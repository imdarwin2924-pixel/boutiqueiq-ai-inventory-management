from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.inventory import Inventory
from app.models.customer import Customer
from app.models.sale import Sale
from app.models.stock_transaction import StockTransaction
from app.models.purchase_order import PurchaseOrder

from app.services.inventory_service import (
    get_inventory_status,
)


# ==========================================================
# DASHBOARD SUMMARY
# ==========================================================

def get_dashboard_summary(
    db: Session,
):
    # ======================================================
    # BASIC COUNTS
    # ======================================================

    products = (
        db.query(Product)
        .all()
    )

    inventory = (
        db.query(Inventory)
        .all()
    )

    customers = (
        db.query(Customer)
        .all()
    )

    sales = (
        db.query(Sale)
        .all()
    )

    stock_transactions = (
        db.query(StockTransaction)
        .all()
    )

    purchase_orders = (
        db.query(PurchaseOrder)
        .all()
    )


    # ======================================================
    # TOTAL SALES
    # ======================================================

    total_sales = sum(
        float(sale.total_amount)
        for sale in sales
    )


    # ======================================================
    # TOTAL STOCK UNITS
    # ======================================================

    total_stock_units = sum(
        inventory_item.quantity
        for inventory_item in inventory
    )


    # ======================================================
    # INVENTORY VALUE
    # ======================================================

    inventory_value = 0.0

    for inventory_item in inventory:

        product = (
            db.query(Product)
            .filter(
                Product.product_id
                == inventory_item.product_id
            )
            .first()
        )

        if product is None:
            continue

        purchase_price = float(
            product.purchase_price or 0
        )

        inventory_value += (
            inventory_item.quantity
            * purchase_price
        )


    # ======================================================
    # INVENTORY STATUS
    # ======================================================

    in_stock = 0
    low_stock = 0
    out_of_stock = 0

    low_stock_items = []
    out_of_stock_items = []

    for inventory_item in inventory:

        inventory_status = (
            get_inventory_status(
                inventory_item
            )
        )

        if inventory_status == "IN_STOCK":

            in_stock += 1

        elif inventory_status == "LOW_STOCK":

            low_stock += 1

            low_stock_items.append(
                inventory_item
            )

        elif inventory_status == "OUT_OF_STOCK":

            out_of_stock += 1

            out_of_stock_items.append(
                inventory_item
            )


    # ======================================================
    # STOCK MOVEMENT
    # ======================================================

    total_stock_in = sum(
        transaction.quantity
        for transaction
        in stock_transactions
        if transaction.transaction_type
        == "IN"
    )

    total_stock_out = sum(
        transaction.quantity
        for transaction
        in stock_transactions
        if transaction.transaction_type
        == "OUT"
    )

    net_stock_movement = (
        total_stock_in
        - total_stock_out
    )


    # ======================================================
    # PURCHASE ANALYTICS
    # ======================================================

    total_purchase_value = sum(
        float(order.total_amount)
        for order in purchase_orders
    )

    pending_purchase_orders = sum(
        1
        for order in purchase_orders
        if order.status
        and order.status.strip().lower()
        == "pending"
    )

    completed_purchase_orders = sum(
        1
        for order in purchase_orders
        if order.status
        and order.status.strip().lower()
        in {
            "completed",
            "complete",
            "received",
        }
    )

    cancelled_purchase_orders = sum(
        1
        for order in purchase_orders
        if order.status
        and order.status.strip().lower()
        in {
            "cancelled",
            "canceled",
        }
    )


    # ======================================================
    # RECENT SALES
    # ======================================================

    recent_sales = (
        db.query(Sale)
        .order_by(
            Sale.sale_date.desc()
        )
        .limit(5)
        .all()
    )


    # ======================================================
    # RECENT STOCK MOVEMENTS
    # ======================================================

    recent_stock_movements = (
        db.query(StockTransaction)
        .order_by(
            StockTransaction.transaction_date.desc()
        )
        .limit(5)
        .all()
    )


    # ======================================================
    # RECENT PURCHASE ORDERS
    # ======================================================

    recent_purchase_orders = (
        db.query(PurchaseOrder)
        .order_by(
            PurchaseOrder.order_date.desc()
        )
        .limit(5)
        .all()
    )


    # ======================================================
    # RETURN DASHBOARD DATA
    # ======================================================

    return {
        "summary": {
            "total_products": len(
                products
            ),

            "total_inventory_items": len(
                inventory
            ),

            "total_customers": len(
                customers
            ),

            "total_sales": total_sales,
        },


        "inventory": {
            "total_stock_units":
                total_stock_units,

            "inventory_value":
                inventory_value,

            "total_inventory":
                len(inventory),

            "in_stock":
                in_stock,

            "low_stock":
                low_stock,

            "out_of_stock":
                out_of_stock,
        },


        "stock_movement": {
            "total_stock_in":
                total_stock_in,

            "total_stock_out":
                total_stock_out,

            "net_stock_movement":
                net_stock_movement,
        },


        "purchases": {
            "total_purchase_orders":
                len(purchase_orders),

            "total_purchase_value":
                total_purchase_value,

            "pending_purchase_orders":
                pending_purchase_orders,

            "completed_purchase_orders":
                completed_purchase_orders,

            "cancelled_purchase_orders":
                cancelled_purchase_orders,
        },


        "alerts": {
            "low_stock_count":
                low_stock,

            "out_of_stock_count":
                out_of_stock,

            "low_stock_items":
                low_stock_items,

            "out_of_stock_items":
                out_of_stock_items,
        },


        "recent_sales":
            recent_sales,


        "recent_stock_movements":
            recent_stock_movements,


        "recent_purchase_orders":
            recent_purchase_orders,
    }