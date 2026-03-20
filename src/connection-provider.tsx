import { Ros, Topic, Message } from "roslib";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// let activeTopics: Topic[] = [];
let activeTopics: InstanceType<typeof Topic>[] = [];
type RosContextType = {
  publishTopic: (
    topicName: string,
    messageType: string,
    message: any
  ) => void;

  subscribeTopic: (
    topicName: string,
    messageType: string,
    callback: (message: any) => void
  ) => void;

  unsubscribeAllTopics: () => void;

  isConnected: boolean;
};

const ConnectionContext = createContext<RosContextType | null>(null);

type ProviderProps = {
  children: ReactNode;
};

function ConnectionProvider({ children }: ProviderProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  // const [ros, setRos] = useState<Ros | null>(null);

  const [ros, setRos] = useState<InstanceType<typeof Ros> | null>(null);

  useEffect(() => {
    const newRos = new Ros({
      url: "ws://127.0.0.1:9090",
    });

    const reconnect = () => {
      setTimeout(() => {
        try {
          newRos.connect("ws://127.0.0.1:9090");
          console.log("Reconnected to ROS");
        } catch (error) {
          console.error("Reconnection error:", error);
        }
      }, 3000);
    };

    try {
      newRos.connect("ws://127.0.0.1:9090");
      setRos(newRos);
    } catch (error) {
      console.error("Initial connection error:", error);
    }

    const handleConnection = () => {
      setIsConnected(true);
      console.log("Connected to ROS");
    };

    const handleClose = () => {
      setIsConnected(false);
      console.log("Disconnected from ROS");
      reconnect();
    };

    newRos.on("connection", handleConnection);
    newRos.on("close", handleClose);
    newRos.on("error", handleClose);

    return () => {
      newRos.close();
    };
  }, []);

  const publishTopic = (
    topicName: string,
    messageType: string,
    message: any
  ) => {
    if (!ros) return;

    const topic = new Topic({
      ros,
      name: topicName,
      messageType,
    });

    topic.publish(new Message(message));
  };

  const subscribeTopic = (
    topicName: string,
    messageType: string,
    callback: (message: any) => void
  ) => {
    if (!ros) return;

    if (activeTopics.some((t) => t.name === topicName)) {
      console.log(`Already subscribed to ${topicName}`);
      return;
    }

    const topic = new Topic({
      ros,
      name: topicName,
      messageType,
    });

    activeTopics.push(topic);

    console.log(`Subscribed to topic: ${topicName}`);

    topic.subscribe((message: any) => {
      callback(message);
    });
  };

  const unsubscribeAllTopics = () => {
    activeTopics.forEach((topic) => {
      topic.unsubscribe();
      console.log(`Force unsubscribed from topic: ${topic.name}`);
    });

    activeTopics = [];
  };

  return (
    <ConnectionContext.Provider
      value={{
        publishTopic,
        subscribeTopic,
        unsubscribeAllTopics,
        isConnected,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

function useRosConnection(): RosContextType {
  const context = useContext(ConnectionContext);

  if (!context) {
    throw new Error(
      "useRosConnection must be used inside ConnectionProvider"
    );
  }

  return context;
}

export { useRosConnection, ConnectionProvider };