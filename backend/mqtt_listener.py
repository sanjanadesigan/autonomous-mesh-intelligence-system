import json
import paho.mqtt.client as mqtt

TOPIC = "mesh/node/telemetry"

node_states = {}


def calculate_stability():

    if not node_states:
        return 100

    healthy_nodes = sum(
        1 for node in node_states.values()
        if node["status"] == "healthy"
    )

    total_nodes = len(node_states)

    return int(
        (healthy_nodes / total_nodes) * 100
    )


def on_message(client, userdata, message):

    payload = json.loads(
        message.payload.decode()
    )

    node_id = payload["node_id"]
    new_status = payload["status"]

    old_status = node_states.get(
        node_id, {}
    ).get("status")

    node_states[node_id] = payload

    print("\n===================")
    print(f"Node: {node_id}")
    print(f"Status: {new_status}")
    print(
        f"Signal: "
        f"{payload['signal_quality']}%"
    )
    print(
        f"Latency: "
        f"{payload['latency']} ms"
    )

    if old_status != new_status:

        print(
            f"EVENT: {node_id} "
            f"changed "
            f"{old_status} → "
            f"{new_status}"
        )

    stability = calculate_stability()

    print(
        f"Network Stability: "
        f"{stability}%"
    )

    print("===================")


client = mqtt.Client()

client.on_message = on_message

client.connect(
    "127.0.0.1",
    1883,
    60
)

client.subscribe(TOPIC)

print(
    "Listening for telemetry..."
)

client.loop_forever()