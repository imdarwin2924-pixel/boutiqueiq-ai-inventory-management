import requests


BASE_URL = "http://127.0.0.1:8000"


ADMIN = {
    "email": "darwin@gmail.com",
    "password": "Darwin123",
}

STAFF = {
    "email": "teststaff@gmail.com",
    "password": "Staff@12345",
}


def login(email, password):
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data={
            "username": email,
            "password": password,
        },
    )

    print(f"\nLOGIN: {email}")
    print("STATUS:", response.status_code)

    if response.status_code != 200:
        print("RESPONSE:", response.text)
        return None

    return response.json()["access_token"]


def test_get_transactions(token, label):
    response = requests.get(
        f"{BASE_URL}/stock-transactions/",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    print(f"\n{label} - GET STOCK TRANSACTIONS")
    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)

    return response


def test_create_transaction(token, label):
    payload = {
        "product_id": 2,
        "transaction_type": "IN",
        "quantity": 5,
        "transaction_date": "2026-09-20T17:30:00",
        "reason": "RBAC test transaction",
        "reference_type": "RBAC_TEST",
        "reference_id": 1,
        "notes": "RBAC test transaction",
    }

    response = requests.post(
        f"{BASE_URL}/stock-transactions/",
        json=payload,
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    print(f"\n{label} - POST STOCK TRANSACTION")
    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)

    return response


def test_update_transaction(token, transaction_id, label):
    payload = {
        "product_id": 2,
        "transaction_type": "IN",
        "quantity": 10,
        "transaction_date": "2026-09-20T17:30:00",
        "reason": "Updated RBAC test transaction",
    }

    response = requests.put(
        f"{BASE_URL}/stock-transactions/{transaction_id}",
        json=payload,
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    print(f"\n{label} - PUT STOCK TRANSACTION {transaction_id}")
    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)

    return response


def test_delete_transaction(token, transaction_id, label):
    response = requests.delete(
        f"{BASE_URL}/stock-transactions/{transaction_id}",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    print(f"\n{label} - DELETE STOCK TRANSACTION {transaction_id}")
    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)

    return response


print("=" * 70)
print("       STOCK TRANSACTION RBAC TEST")
print("=" * 70)


# ============================================================
# LOGIN
# ============================================================

admin_token = login(
    ADMIN["email"],
    ADMIN["password"]
)

staff_token = login(
    STAFF["email"],
    STAFF["password"]
)


# ============================================================
# ADMIN TESTS
# ============================================================

admin_transaction_id = None

if admin_token:

    # GET
    test_get_transactions(
        admin_token,
        "ADMIN"
    )

    # POST
    admin_create_response = test_create_transaction(
        admin_token,
        "ADMIN"
    )

    # Get created transaction ID
    if admin_create_response.status_code in [200, 201]:
        try:
            admin_transaction_id = (
                admin_create_response.json()
                .get("transaction_id")
            )
        except ValueError:
            admin_transaction_id = None


# ============================================================
# STAFF TESTS
# ============================================================

if staff_token:

    # GET
    test_get_transactions(
        staff_token,
        "STAFF"
    )

    # POST
    staff_create_response = test_create_transaction(
        staff_token,
        "STAFF"
    )


# ============================================================
# UPDATE TESTS
# ============================================================

if admin_token and admin_transaction_id:

    # Admin should be allowed to update
    admin_update_response = test_update_transaction(
        admin_token,
        admin_transaction_id,
        "ADMIN"
    )

    # Staff should NOT be allowed to update
    if staff_token:
        staff_update_response = test_update_transaction(
            staff_token,
            admin_transaction_id,
            "STAFF"
        )

else:
    print(
        "\nWARNING: Could not obtain transaction ID "
        "for PUT tests."
    )


# ============================================================
# DELETE TESTS
# ============================================================

if admin_token and admin_transaction_id:

    # Staff should NOT be allowed to delete
    if staff_token:
        staff_delete_response = test_delete_transaction(
            staff_token,
            admin_transaction_id,
            "STAFF"
        )

    # Admin should be allowed to delete
    admin_delete_response = test_delete_transaction(
        admin_token,
        admin_transaction_id,
        "ADMIN"
    )

else:
    print(
        "\nWARNING: Could not obtain transaction ID "
        "for DELETE tests."
    )


# ============================================================
# EXPECTED RESULTS
# ============================================================

print("\n" + "=" * 70)
print("EXPECTED RESULTS")
print("=" * 70)

print("Admin GET     -> 200")
print("Admin POST    -> 200 or 201")
print("Staff GET     -> 200")
print("Staff POST    -> 403")

print("Admin PUT     -> 200")
print("Staff PUT     -> 403")

print("Admin DELETE  -> 200")
print("Staff DELETE  -> 403")

print("=" * 70)