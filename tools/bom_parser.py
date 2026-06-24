"""
BOM Parser Tool — Parse BOM CSV files for a product SKU.

Rules:
  1. Language: VI first (lang='auto'), 中文 only for ZH-only users
  2. Color: default 黑色/đen, but always list all available colors
  3. Output: 7 columns |物料编码|物料名称|规格型号|颜色|属性|部件编号|数量|

Usage:
    from tools.bom_parser import parse_product_bom
    result = parse_product_bom("LGS031", data_dir="data")
    print(result["summary"])
"""

from __future__ import annotations

import sys
from pathlib import Path

# Make sure tools module is importable
_project_root = Path(__file__).resolve().parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

from tools.comparator import parse_bom, BomItem


# ═══════════════════════════════════════════════════════════════
# Public API
# ═══════════════════════════════════════════════════════════════

def parse_product_bom(
    sku_id: str,
    data_dir: str,
    lang: str = "auto",
) -> dict:
    """
    Parse BOM CSV for a product SKU.

    Args:
        sku_id:   Product SKU, e.g. 'LGS031'
        data_dir: Path to data/ directory
        lang:     'vi' | 'zh' | 'auto' (VI first)

    Returns:
        dict with status, items (7 columns), color info.
    """
    bom = parse_bom(sku_id, data_dir, lang)

    if not bom.items:
        return {
            "status": "error",
            "error_message": f"BOM file for SKU '{sku_id}' not found.",
        }

    # Build 7-column rows
    all_items = _build_rows(bom.items)

    # Category summary
    cat_summary = {}
    for item in bom.items:
        cat = item.category or "未知"
        cat_summary[cat] = cat_summary.get(cat, 0) + 1

    # Summary text
    summary_lines = [
        f"BOM / 物料清单 {sku_id}:",
        f"  File: {bom.file}",
        f"  Tổng số / 总数: {len(bom.items)} chi tiết/件",
        f"  Màu hiện tại / 当前颜色: {bom.color_used}",
        f"  Các màu có sẵn / 可用颜色: {', '.join(bom.available_colors)} ({len(bom.available_colors)} màu/色)",
        f"  Phân loại / 分类: {', '.join(f'{k}={v}' for k, v in sorted(cat_summary.items()))}",
    ]
    if bom.fallback_warning:
        summary_lines.append(f"  ⚠️ {bom.fallback_warning}")

    return {
        "status": "success",
        "sku": sku_id,
        "file": bom.file,
        "total_items": len(all_items),
        "items": all_items,
        "current_color": bom.color_used,
        "available_colors": bom.available_colors,
        "color_count": len(bom.available_colors),
        "category_summary": cat_summary,
        "fallback_warning": bom.fallback_warning or None,
        "summary": "\n".join(summary_lines),
    }


# ═══════════════════════════════════════════════════════════════
# 7-column table builder
# ═══════════════════════════════════════════════════════════════

def _build_rows(items: list[BomItem]) -> list[dict]:
    """Convert BomItems to 7-column dicts."""
    result = []
    for item in items:
        row = {}
        row["物料编码/mã vật liệu"] = item.material_code or ""
        row["物料名称/tên vật liệu"] = item.material_name or ""
        row["规格型号/quy cách"] = item.spec or ""
        row["颜色/màu sắc"] = item.color or ""
        row["属性/thuộc tính"] = item.category or ""
        row["部件编号/mã linh kiện"] = item.component_code or ""
        qty = item.qty
        if qty:
            row["数量/số lượng"] = int(qty) if qty == int(qty) else qty
        else:
            row["数量/số lượng"] = 0
        result.append(row)
    return result


# ═══════════════════════════════════════════════════════════════
# CLI Test
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    data_dir = str(_project_root / "data")

    print("=" * 60)
    print("BOM PARSER — TEST")
    print("=" * 60)

    for sku in ["LGS031", "LGS033", "LGS132"]:
        print()
        print(f"--- {sku} ---")
        r = parse_product_bom(sku, data_dir)
        print(r.get("summary", ""))

        if r.get("items"):
            headers = list(r["items"][0].keys())
            print(f"\n{' | '.join(headers)}")
            print("-" * 80)
            for row in r["items"][:3]:
                vals = [str(v) for v in row.values()]
                print(" | ".join(vals))
            if len(r["items"]) > 3:
                print(f"... {len(r['items']) - 3} more items")

    print()
    print("=" * 60)
