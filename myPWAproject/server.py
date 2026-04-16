from flask import Flask, request, jsonify, send_from_directory, session
import sqlite3
import uuid

app = Flask(__name__, static_folder='public', static_url_path='')
app.secret_key = '1234566789' # Change to something more secure

@app.route('/')
def index():
    return app.send_static_file('Index.html')

@app.route('/src/<path:path>')
def src_files(path):
    return send_from_directory('src', path)

@app.route('/sw.js')
def service_worker():
    return app.send_static_file('sw.js')

@app.route('/manifest.json')
def manifest():
    return app.send_static_file('manifest.json')


def query_db(query, params=()):
    conn = sqlite3.connect('clothes.db')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.route('/api/clothes', methods=['GET'])
def get_clothes():
    filter_text = request.args.get('filter', '')
    sort = request.args.get('sort', '')

    query = "SELECT * FROM clothes "
    params = []

    if filter_text:
        query += "WHERE LOWER(name) LIKE ? OR LOWER(collection) LIKE ? "
        params.append(f"%{filter_text.lower()}%")
        params.append(f"%{filter_text.lower()}%")

    sort_map = {
        'new': 'id DESC',
        'id': 'id DESC',
        'name': 'name ASC',
        'collection': 'collection ASC',
        'type': 'type ASC',
        'price_l2h': 'price ASC',
        'price_h2l': 'price DESC'
    }

    sorting = sort_map.get(sort.lower()) if sort else None
    if sorting:
        query += f"ORDER BY {sorting}"

    clothes = query_db(query, params)
    return jsonify(clothes)


## Cart Database ##
def get_or_create_cart(session_id):
    conn = sqlite3.connect('clothes.db')
    cur = conn.cursor()
    cur.execute("INSERT OR IGNORE INTO carts (session_id) VALUES (?)", (session_id,))
    conn.commit()
    cur.execute("SELECT id FROM carts WHERE session_id = ?", (session_id,))
    cart_id = cur.fetchone()[0]
    conn.close()
    return cart_id

@app.route('/api/cart', methods=['GET'])
def get_cart():
    session_id = session.get('cart_id') or str(uuid.uuid4())
    session['cart_id'] = session_id
    cart_id = get_or_create_cart(session_id)

    conn = sqlite3.connect('clothes.db')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("""
        SELECT c.id, c.name, c.price, c.image, ci.quantity
        FROM cart_items ci
        JOIN clothes c ON c.id = ci.clothes_id
        WHERE ci.cart_id = ?
    """, (cart_id,))
    items = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify(items)

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    clothes_id = data.get('clothes_id')
    quantity = data.get('quantity', 1)

    session_id = session.get('cart_id') or str(uuid.uuid4())
    session['cart_id'] = session_id
    cart_id = get_or_create_cart(session_id)

    conn = sqlite3.connect('clothes.db')
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO cart_items (cart_id, clothes_id, quantity)
        VALUES (?, ?, ?)
        ON CONFLICT(cart_id, clothes_id)
        DO UPDATE SET quantity = quantity + excluded.quantity
    """, (cart_id, clothes_id, quantity))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/cart/remove', methods=['POST'])
def remove_from_cart():
    data = request.get_json()
    clothes_id = data.get('clothes_id')
    session_id = session.get('cart_id')
    if not session_id:
        return jsonify({'success': False})

    conn = sqlite3.connect('clothes.db')
    cur = conn.cursor()
    cur.execute("""
        DELETE FROM cart_items WHERE cart_id = (
            SELECT id FROM carts WHERE session_id = ?
        ) AND clothes_id = ?
    """, (session_id, clothes_id))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(port=3000, debug=True)