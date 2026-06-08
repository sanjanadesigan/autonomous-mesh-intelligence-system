import json
import random
import time
import paho.mqtt.client as mqtt

NODE_ID = "NODE_02"

client = mqtt.Client()

client.connect("127.0.0.1", 1883, 60)

print(f"{NODE_ID} started")

start_time = time.time()

states = [
    "healthy",
    "degraded",
    "offline",
    "recovering"
]

while True:

    uptime = int(time.time() - start_time)

    status = random.choice(states)

    if status == "healthy":
        signal_quality = random.randint(80, 100)
        latency = random.randint(10, 30)

    elif status == "degraded":
        signal_quality = random.randint(40, 70)
        latency = random.randint(60, 120)

    elif status == "recovering":
        signal_quality = random.randint(60, 85)
        latency = random.randint(30, 60)

    else:
        print(f"{NODE_ID} OFFLINE")
        time.sleep(5)
        continue

    telemetry = {
        "node_id": NODE_ID,
        "status": status,
        "uptime": uptime,
        "signal_quality": signal_quality,
        "latency": latency
    }

    client.publish(
        "mesh/node/telemetry",
        json.dumps(telemetry)
    )

    print("Telemetry Sent:")
    print(telemetry)

    time.sleep(3)