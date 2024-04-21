from flask import Flask, render_template, request, jsonify
from typing import List, Optional 
from sqlalchemy import ForeignKey, select, String, Text, DECIMAL, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)


engine = create_engine(os.getenv('CONNECTION_STRING'), echo=True)
engine.connect()

class Base(DeclarativeBase):
    pass

class Products(Base):
    __tablename__ = "products"  
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[float] = mapped_column(DECIMAL, nullable=False)
    inventory = relationship("Inventory", back_populates="product")

class Locations(Base):
    __tablename__ = "locations"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    inventory = relationship("Inventory", back_populates="location")

class Inventory(Base):
    __tablename__ = "inventory"
    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.id"))
    quantity: Mapped[int] = mapped_column(nullable=False)
    product = relationship("Products", back_populates="inventory")
    location = relationship("Locations", back_populates="inventory")



session = Session(engine)

@app.route("/")
def hello_world(name = None):
    query = session.query(Products)
    products = query.all()

    query = session.query(Inventory).join(Locations)
    raw_inventory = query.all()

    query = session.query(Locations)
    locations = query.all()

    return render_template('start_page.html', name=name, products_list = products, inventory_list = raw_inventory, locations_list = locations)



@app.route('/add', methods = ['POST', 'GET'])
def add_handler():
    data = request.json
    products_list = []
    locations_list = []
    inventory_list = []

    product = data.get('product_id')
    add_quantity = data.get('quantity')
    warehouse = data.get('warehouse')

    query = session.query(Inventory).where(Inventory.product_id == int(product)).where(Inventory.location_id == int(warehouse))
    add = query.all()

    if len(add) == 0:
        add_inventory = Inventory(
            product_id = int(product),
            location_id = int(warehouse),
            quantity = add_quantity,
        )
        session.add(add_inventory)
        session.commit()
    else:
        for item in add:
            item.quantity += int(add_quantity)
        session.commit()

    
    
    query = session.query(Products).where(Products.id == int(product))
    products = query.all()
    for item in products:
        dictret = dict(item.__dict__); dictret.pop('_sa_instance_state', None)
        products_list.append(dictret)
    
    query = session.query(Inventory).where(Inventory.product_id == int(product)).where(Inventory.location_id == int(warehouse))
    raw_inventory = query.all()
    for item in raw_inventory:
        dictret = dict(item.__dict__); dictret.pop('_sa_instance_state', None)
        inventory_list.append(dictret)

    query = session.query(Locations).where(Locations.id == int(warehouse))
    locations = query.all()
    for item in locations:
        dictret = dict(item.__dict__); dictret.pop('_sa_instance_state', None)
        locations_list.append(dictret)

    
    return jsonify(products_list, inventory_list, locations_list)
    
@app.route('/delete_entry', methods = ['POST', 'GET'])
def delete_handler():
    data = request.json
    products_list = []
    locations_list = []
    inventory_list = []

    product = data.get('product_id')
    delete_quantity = data.get('quantity')
    warehouse = data.get('warehouse')

    query = session \
        .query(Inventory) \
        .where(Inventory.product_id == int(product)) \
        .where(Inventory.location_id == int(warehouse))
    
    delete = query.all()

    for item in delete:
        item.quantity -= int(delete_quantity)

    session.commit()
    
    query = session.query(Products).where(Products.id == int(product))
    products = query.all()
    for item in products:
        dictret = dict(item.__dict__); dictret.pop('_sa_instance_state', None)
        products_list.append(dictret)
    
    query = session.query(Inventory).where(Inventory.product_id == int(product)).where(Inventory.location_id == int(warehouse))
    raw_inventory = query.all()
    for item in raw_inventory:
        dictret = dict(item.__dict__); dictret.pop('_sa_instance_state', None)
        inventory_list.append(dictret)

    query = session.query(Locations).where(Locations.id == int(warehouse))
    locations = query.all()
    for item in locations:
        dictret = dict(item.__dict__); dictret.pop('_sa_instance_state', None)
        locations_list.append(dictret)

    
    return jsonify(products_list, inventory_list, locations_list)
    session.close()

@app.route('/create_product', methods = ['POST', 'GET'])
def product_handler():
    data = request.json
    product = []
    locations = []

    product_name = data.get('productName')
    product_description = data.get('productDescription')
    product_price = data.get('productPrice')

    add_product = Products(
        name = product_name,
        description = product_description,
        price = product_price
    )

    query = session.query(Products)
    product_buff = query.all()
    id_getter = len(product_buff) + 1

    session.add(add_product)
    session.commit()

    query = session.query(Products).where(Products.id == id_getter)
    new_product = query.all()
    for item in new_product:
        dictret = dict(item.__dict__); dictret.pop('_sa_instance_state', None)
        product.append(dictret)
    
    query = session.query(Locations)
    new_locations = query.all()
    for item in new_locations:
        dictret = dict(item.__dict__); dictret.pop('_sa_instance_state', None)
        locations.append(dictret)

    return jsonify(product, locations)

@app.route('/create_location', methods = ['POST', 'GET'])
def location_handler():
    data = request.json
    location = []

    location_name = data.get('locationName')

    add_location = Locations(
        name = location_name
    )

    query = session.query(Locations)
    location_buff = query.all()
    id_getter = len(location_buff) + 1

    session.add(add_location)
    session.commit()

    query = session.query(Locations).where(Locations.id == id_getter)
    new_location = query.all()
    for item in new_location:
        dictret = dict(item.__dict__); dictret.pop('_sa_instance_state', None)
        location.append(dictret)
    
    return jsonify(location)

