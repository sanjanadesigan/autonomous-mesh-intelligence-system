import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [nodes, setNodes] =
    useState({});

  useEffect(() => {

    const fetchNodes = async () => {

      try {

        const response =
          await axios.get(
            "https://autonomous-mesh-intelligence-system-production.up.railway.app/nodes"
          );

        setNodes(response.data);

      } catch (error) {

        console.log(error);
      }
    };

    fetchNodes();

    const interval =
      setInterval(fetchNodes, 2000);

    return () =>
      clearInterval(interval);

  }, []);

  const getStatusColor =
    (status) => {

      switch (status) {

        case "healthy":
          return "#22C55E";

        case "degraded":
          return "#F59E0B";

        case "offline":
          return "#EF4444";

        case "recovering":
          return "#3B82F6";

        default:
          return "#FFFFFF";
      }
    };

  const totalNodes =
    Object.keys(nodes).length;

  const onlineNodes =
    Object.values(nodes).filter(
      node =>
        node.status !==
        "offline"
    ).length;

  const degradedNodes =
    Object.values(nodes).filter(
      node =>
        node.status ===
        "degraded"
    ).length;

  const stability =
    totalNodes
      ? Math.round(
          (onlineNodes /
            totalNodes) * 100
        )
      : 0;

  return (

    <div
      style={{
        background:
          "#050505",
        minHeight:
          "100vh",
        color:
          "white",
        padding:
          "40px",
        fontFamily:
          "Arial"
      }}
    >

      <div
        style={{
          maxWidth:
            "1200px",
          margin:
            "0 auto"
        }}
      >

        <h1
          style={{
            textAlign:
              "center",
            fontSize:
              "42px",
            marginBottom:
              "40px",
            fontWeight:
              "600"
          }}
        >
          Autonomous Mesh
          Intelligence
        </h1>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap:
              "20px",
            marginBottom:
              "35px"
          }}
        >

          <div
            style={{
              background:
                "#151515",
              padding:
                "25px",
              borderRadius:
                "20px"
            }}
          >
            <h3>
              Network Stability
            </h3>

            <h1>
              {stability}%
            </h1>
          </div>

          <div
            style={{
              background:
                "#151515",
              padding:
                "25px",
              borderRadius:
                "20px"
            }}
          >
            <h3>
              Online Nodes
            </h3>

            <h1>
              {onlineNodes}/
              {totalNodes}
            </h1>
          </div>

          <div
            style={{
              background:
                "#151515",
              padding:
                "25px",
              borderRadius:
                "20px"
            }}
          >
            <h3>
              Degraded Nodes
            </h3>

            <h1>
              {degradedNodes}
            </h1>
          </div>

        </div>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(2, 1fr)",
            gap:
              "25px"
          }}
        >

          {Object.values(nodes)
            .map((node) => (

            <div
              key={node.node_id}
              style={{
                background:
                  "#151515",
                borderRadius:
                  "20px",
                padding:
                  "28px",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,0.35)"
              }}
            >

              <h2>
                {node.node_id}
              </h2>

              <p>
                Status:
                {" "}
                <span
                  style={{
                    color:
                      getStatusColor(
                        node.status
                      ),
                    fontWeight:
                      "bold"
                  }}
                >
                  {node.status}
                </span>
              </p>

              <p>
                Signal:
                {" "}
                {node.signal_quality}%
              </p>

              <p>
                Latency:
                {" "}
                {node.latency} ms
              </p>

              <p>
                Uptime:
                {" "}
                {node.uptime}s
              </p>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;