import sqlite3

from flask import Flask, redirect, render_template
app = Flask(__name__)

current_encounter = None

@app.route('/')
def index():
    return render_template('encounter.html')

@app.route('/<encounter_name>')
def encounter(encounter_name):
    return render_template('encounter.html', encounter_name=encounter_name)

def get_battlemap_info(encounter_name):
    with sqlite3.connect(f'encounters/{encounter_name}.db') as connection:
        print(f'connected to database {encounter_name}.db')
        cursor = connection.cursor()
        try:
            cursor.execute('SELECT * FROM objects')
            cursor.execute('SELECT * FROM terrain')
            return {'objects': cursor.fetchall(), 'terrain': cursor.fetchall()}
        except sqlite3.OperationalError:
            print(f'initializing database {encounter_name}.db')
            cursor.execute('CREATE TABLE objects (name TEXT, x INTEGER, y INTEGER)')
            cursor.execute('CREATE TABLE terrain (name TEXT, x INTEGER, y INTEGER)')
            return {'objects': [], 'terrain': []}

if __name__ == '__main__':
    app.run(debug=True)
