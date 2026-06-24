"""
Compare two product BOMs (CSV-based).

Rules:
  1. Default color: 黑色/đen → fallback 复古色/gỗ cổ
  2. Matching: (tên vật liệu + quy cách) same = shared part
  3. Different component codes on same part → ⚠️ warning

Usage:
    from tools.comparator import compare_bom
    r = compare_bom("LGS031", "LGS032", "data")
    print(r["summary"])
"""

from __future__ import annotations

import csv
import glob
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

# ── Constants ──
ZH = {"material_code":"物料编码","component_code":"部件编号","material_name":"物料名称",
      "spec":"规格型号","material_type":"材质","color":"颜色","category":"属性",
      "qty":"数量","color_version":"颜色版本"}
VI = {"material_code":"mã vật liệu","component_code":"mã linh kiện","material_name":"tên vật liệu",
      "spec":"quy cách","material_type":"chất liệu","color":"màu sắc","category":"thuộc tính",
      "qty":"số lượng","color_version":"màu phiên bản"}
_CAT_VI2ZH = {"linh kiện":"零件","vật liệu đóng gói":"包材","túi ngũ kim":"五金包"}
_COLORS_ZH = ["黑色","复古色","白色"]
_COLORS_VI = ["màu đen","màu gỗ cổ","màu trắng"]

@dataclass
class BomItem:
    material_code: str = ""; component_code: str = ""; material_name: str = ""
    spec: str = ""; material_type: str = ""; color: str = ""
    category: str = ""; qty: float = 0.0; color_version: str = ""

@dataclass
class BomData:
    sku: str = ""; file: str = ""; color_used: str = ""
    items: list = field(default_factory=list)
    available_colors: list = field(default_factory=list); fallback_warning: str = ""

# ── File helpers ──
def _find(sku: str, data_dir: str, lang: str) -> Optional[Path]:
    """Find BOM CSV: lang=zh→中文, vi→VI, auto→中文 first"""
    d = Path(data_dir)/"sample_bom"
    if lang=="zh": pats=[f"BOM_{sku}*_中文.csv"]
    elif lang=="vi": pats=[f"BOM_{sku}*_VI.csv"]
    else: pats=[f"BOM_{sku}*_中文.csv",f"BOM_{sku}*_VI.csv",f"BOM_{sku}*.csv"]
    for p in pats:
        m=glob.glob(str(d/p))
        if m: return Path(m[0])
    return None

def _pick_color(colors: list[str], lang: str) -> str:
    p = _COLORS_ZH if lang!="vi" else _COLORS_VI
    for t in p:
        for c in colors:
            if t in c: return c
    return colors[0] if colors else ""

def _norm_cat(raw: str, lang: str, mat: str="") -> str:
    r=raw.strip()
    cat= _CAT_VI2ZH.get(r.lower(),"零件") if lang=="vi" else (r if r in("零件","包材","五金包") else "零件")
    if cat=="零件" and mat:
        m=mat.upper()
        if "Q195" in m or "冷轧" in mat or "镀锌" in mat: return "铁件"
    return cat

def _parse_qty(v) -> float:
    try:
        return float(str(v).strip())
    except (ValueError, AttributeError, TypeError):
        return 0.0

def _read_csv(path: Path) -> list[dict]:
    for enc in ["utf-8-sig","utf-8","gbk"]:
        try:
            with open(path,encoding=enc) as f: return list(csv.DictReader(f))
        except (UnicodeDecodeError, FileNotFoundError):
            continue
    return []

def parse_bom(sku: str, data_dir: str, lang: str="auto") -> BomData:
    """Parse BOM CSV → BomData (color: 黑 first → fallback)"""
    fp=_find(sku,data_dir,lang)
    if not fp: return BomData(sku=sku)
    alang="zh" if "_中文" in fp.name else "vi"
    rows=_read_csv(fp)
    if not rows: return BomData(sku=sku,file=fp.name)
    cols=ZH if alang=="zh" else VI
    cc=cols["color_version"]
    seen=[]
    for r in rows:
        c=r.get(cc,"").strip()
        if c and c not in seen: seen.append(c)
    chosen=_pick_color(seen,alang)
    has_black=any(("黑色" in c) or ("màu đen" in c.lower()) for c in seen)
    fallback="" if has_black or not chosen else (
        f"⚠️  {sku} does not have 黑色/đen. Using '{chosen}' instead. 物料编码 may differ from products with 黑色."
    )
    items=[]
    for r in rows:
        if r.get(cc,"").strip()!=chosen: continue
        mc=r.get(cols["material_code"],"").strip()
        if not mc or mc=="-": continue
        nm=r.get(cols["material_name"],"").strip()
        if not nm: continue
        items.append(BomItem(
            material_code=mc,component_code=r.get(cols["component_code"],"").strip(),
            material_name=nm,spec=r.get(cols["spec"],"").strip(),
            material_type=r.get(cols["material_type"],"").strip(),
            color=r.get(cols["color"],"").strip(),
            category=_norm_cat(r.get(cols["category"],""),alang,r.get(cols["material_type"],"").strip()),
            qty=_parse_qty(r.get(cols["qty"])),color_version=chosen,
        ))
    return BomData(sku=sku,file=fp.name,color_used=chosen,items=items,
                   available_colors=seen,fallback_warning=fallback)

def _fmt_qty(a:float,b:float)->str:
    if a==b: return str(int(a)) if a==int(a) else str(a)
    return f"{int(a) if a==int(a) else a}/{int(b) if b==int(b) else b}"

# ── Main compare ──
def compare_bom(base_sku:str, compare_sku:str, data_dir:str,
                diff_target:str="full", lang:str="auto", category:str="all")->dict:
    """Compare two BOMs. Match by (name,spec). ⚠️ on component code diff."""
    base=parse_bom(base_sku,data_dir,lang)
    cmp=parse_bom(compare_sku,data_dir,lang)
    if not base.items: return {"error":True,"message":f"[Base] BOM '{base_sku}' not found."}
    if not cmp.items: return {"error":True,"message":f"[Cmp] BOM '{compare_sku}' not found."}
    def _k(i): return (i.material_name, i.spec)
    # Build lookup dicts by (name, spec) key
    base_map = {_k(i): i for i in base.items}
    cmp_map = {_k(i): i for i in cmp.items}
    base_keys = set(base_map.keys())
    cmp_keys = set(cmp_map.keys())
    # Classify: common, unique-to-base, unique-to-compare
    common_keys = base_keys & cmp_keys
    unique_base = base_keys - cmp_keys
    unique_cmp = cmp_keys - base_keys
    parts = []
    qdiffs = []
    cwarn = []
    for k in sorted(common_keys, key=lambda x: x[0]):
        b = base_map[k]
        c = cmp_map[k]
        if category!="all" and b.category!=category: continue
        qd=b.qty!=c.qty; cd=bool(b.component_code and c.component_code and b.component_code!=c.component_code)
        info={"material_name":b.material_name,"base_spec":b.spec,"compare_spec":c.spec,
              "base_qty":b.qty,"compare_qty":c.qty,"base_component_code":b.component_code,
              "compare_component_code":c.component_code,"base_material_type":b.material_type,
              "compare_material_type":c.material_type,"category":b.category,
              "qty_differs":qd,"comp_code_differs":cd}
        parts.append(info)
        if qd: qdiffs.append(info)
        if cd: cwarn.append({"material_name":b.material_name,"spec":b.spec,
                             "base_component_code":b.component_code,"compare_component_code":c.component_code})
    ubl=[{"material_name":k[0],"spec":k[1],"material_code":base_map[k].material_code,
          "component_code":base_map[k].component_code,"material_type":base_map[k].material_type,
          "category":base_map[k].category,"qty":base_map[k].qty} for k in sorted(unique_base,key=lambda x:x[0])]
    ucl=[{"material_name":k[0],"spec":k[1],"material_code":cmp_map[k].material_code,
          "component_code":cmp_map[k].component_code,"material_type":cmp_map[k].material_type,
          "category":cmp_map[k].category,"qty":cmp_map[k].qty} for k in sorted(unique_cmp,key=lambda x:x[0])]
    if diff_target=="parts": qdiffs=[]
    elif diff_target=="qty": parts=qdiffs
    total=len(base_keys|cmp_keys); sim=len(common_keys)/total if total>0 else 0.0
    # Collect fallback warnings from both BOMs
    fw = []
    for b in [base, cmp]:
        if b.fallback_warning:
            fw.append(b.fallback_warning)
    sl=[f"So sánh / 比较 {base_sku} vs {compare_sku}{' (lọc/filter: '+category+')' if category!='all' else ''}:",
        f"  {base_sku}: {len(base.items)} chi tiết/件 (màu/颜色 '{base.color_used}')",
        f"  {compare_sku}: {len(cmp.items)} chi tiết/件 (màu/颜色 '{cmp.color_used}')",
        f"  Giống nhau / 相同: {len(parts)} chi tiết/件",
        f"  Chỉ có trong / 仅在 {base_sku}: {len(ubl)} chi tiết/件",
        f"  Chỉ có trong / 仅在 {compare_sku}: {len(ucl)} chi tiết/件",
        f"  Khác số lượng / 数量差异: {len(qdiffs)} chi tiết/件",
        f"  Điểm tương đồng / 相似度: {sim:.1%}"]
    if cwarn:
        sl.append(""); sl.append(f"⚠️  CẢNH BÁO mã linh kiện/部件编号 KHÁC ({len(cwarn)} chi tiết/件):")
        for w in cwarn:
            sl.append(f"  {w['material_name']}/物料名称 ({w['spec']}/规格型号): {base_sku}={w['base_component_code']}, {compare_sku}={w['compare_component_code']}")
    if fw:
        sl.append(""); sl.append("⚠️  LƯU Ý MÀU SẮC / 颜色注意事项:")
        for x in fw: sl.append(f"  {x}")
    if parts:
        sl.append(""); sl.append(f"DANH SÁCH CHI TIẾT GIỐNG NHAU / 相同物料清单 ({len(parts)}):")
        sl.append("| 物料名称/tên vật liệu | 规格型号/quy cách | 属性/thuộc tính | 部件编号/mã linh kiện |")
        sl.append("|-----|----------|------|------|")
        for p in parts:
            sp=p["base_spec"] if p["base_spec"]==p["compare_spec"] else f"{p['base_spec']}/{p['compare_spec']}"
            cc=p["base_component_code"] if p["base_component_code"]==p["compare_component_code"] else f"{p['base_component_code']}/{p['compare_component_code']}"
            w=" ⚠️" if p["comp_code_differs"] else ""
            sl.append(f"| {p['material_name']} | {sp} | {p['category']} | {cc}{w} |")
    return {"error":False,"base_sku":base_sku,"compare_sku":compare_sku,"diff_target":diff_target,
            "base_file":base.file,"compare_file":cmp.file,"base_sheet":base.color_used,
            "compare_sheet":cmp.color_used,"base_total":len(base.items),"compare_total":len(cmp.items),
            "common_parts":parts,"unique_to_base":ubl,"unique_to_compare":ucl,
            "qty_differences":qdiffs,"common_count":len(parts),"unique_base_count":len(ubl),
            "unique_compare_count":len(ucl),"qty_diff_count":len(qdiffs),
            "similarity_score":round(sim,4),"code_warnings":cwarn,"fallback_warnings":fw,
            "summary":"\n".join(sl)}

if __name__=="__main__":
    import json; d=str(Path(__file__).resolve().parent.parent/"data")
    r=compare_bom("LGS031","LGS032",d)
    print(r["summary"] if not r.get("error") else f"ERROR: {r['message']}")
