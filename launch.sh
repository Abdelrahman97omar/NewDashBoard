echo '246810' | sudo -S echo "launch" &&
xhost +local:root &&
docker run -v /home/${USER}:/home/${USER} -v /run/dbus/system_bus_socket:/run/dbus/system_bus_socket -v /home/abdelrahman/Event_Apps/duet-orange:/home/event -e ROBOT_ID=$ROBOT_ID -e USER=duet --privileged --net="host" -e DISPLAY=$DISPLAY -it marsesrobotics/ubuntu20-ros-noetic:ROS /bin/bash -c "sleep 0; ./duet/launch.sh; exec bash"
