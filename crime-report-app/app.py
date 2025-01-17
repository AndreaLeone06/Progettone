from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS
from datetime import datetime
from flask import Flask, request, jsonify

app = Flask(__name__)
# Permette di fare richieste da qualsiasi origine
CORS(app, resources={r"/api/": {"origins": ""}}) 

# Connessione al database
uri = "mongodb+srv://API:xxx123xxx@safezone.lrtrk.mongodb.net/?retryWrites=true&w=majority&appName=safezone"
client = MongoClient(uri)
client.admin.command('ping')  # Controlla la connessione al database
database = client["mappaUtenti"]  # Scegli il database
collection = database["segnalazioni"]  # Scegli la collezione

# Endpoint per registrare dati
@app.route('/api/ins', methods=['POST'])
def ins_dati():
    data = request.get_json()
    data_inserimento = datetime.now()
    utente = data.get('utente', {})
    dove = data.get('dove')
    rating = data.get('rating')
    tipo_di_crimine = data.get('tipo_di_crimine')
    geometry = data.get('geometry', {})

    # Controllo dei campi obbligatori
    if not all([utente, dove, rating, tipo_di_crimine, geometry]):
        return jsonify({"error": "Missing required fields"}), 400

    # Verifica della struttura dell'utente
    if not all(key in utente for key in ['nome', 'cognome', 'data_nascita']):
        return jsonify({"error": "Invalid user structure"}), 400

    # Verifica se l'email esiste già (opzionale, se applicabile)
    if collection.find_one({"utente.nome": utente['nome']}):
        return jsonify({"error": "Name already exists"}), 409

    # Costruisci il documento per MongoDB
    new_crime = {
        "data_inserimento": data_inserimento,
        "utente": {
            "nome": utente['nome'],
            "cognome": utente['cognome'],
            "data_nascita": utente['data_nascita']
        },
        "dove": dove,
        "rating": rating,
        "tipo_di_crimine": tipo_di_crimine,
        "geometry": {
            "type": "Point",
            "coordinates": geometry.get('coordinates')  # Assumi che sia un array [long, lat]
        }
    }

    # Inserisci il documento nel database
    collection.insert_one(new_crime)
    return jsonify({"message": "Crime data inserted successfully"}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
