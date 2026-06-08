#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

const char* mqtt_server = "test.mosquitto.org";

WiFiClient espClient;
PubSubClient client(espClient);

String NODE_ID = "NODE_01";

void reconnect() {

    while (!client.connected()) {

        Serial.println("Connecting to MQTT...");

        if (client.connect("NODE_01")) {

            Serial.println("MQTT Connected");

        } else {

            Serial.println("Retrying in 3 sec...");
            delay(3000);
        }
    }
}

void setup() {

    Serial.begin(115200);

    client.setServer(mqtt_server, 1883);

    Serial.println("Node Booted");
}

void loop() {

    if (!client.connected()) {
        reconnect();
    }

    client.loop();

    String message =
        "{\"node_id\":\"NODE_01\","
        "\"status\":\"healthy\"}";

    client.publish(
        "mesh/node/telemetry",
        message.c_str()
    );

    Serial.println("Telemetry Sent:");
    Serial.println(message);

    delay(3000);
}