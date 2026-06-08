from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import threading
import paho.mqtt.client as mqtt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://autonomous-mesh-intelligence-system.vercel.app",
        "https://autonomous-mesh-intelligence-system-bnhqxn43c.vercel.app",
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
nodes = {}

TOPIC = "mesh/node/telemetry"


def on_message(client, userdata, message):

    payload = json.loads(
        message.payload.decode()
    )

    node_id = payload["node_id"]

    nodes[node_id] = payload


def mqtt_loop():

    client = mqtt.Client()

    client.on_message = on_message

    client.connect(
        "broker.hivemq.com",
        1883,
        60
    )

    client.subscribe(TOPIC)

    client.loop_forever()


mqtt_thread = threading.Thread(
    target=mqtt_loop,
    daemon=True
)

mqtt_thread.start()


@app.get("/")
def home():

    return {
        "message":
        "Autonomous Mesh Intelligence API"
    }


@app.get("/nodes")
def get_nodes():

    return nodes