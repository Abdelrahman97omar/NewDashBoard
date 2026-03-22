#gnome-terminal -- bash -c "nvm use 20; sleep 4; npm run dev; exec bash"
#gnome-termianl -- bash -c "nvm use 20; sleep 4; npm run css; exec bash"
gnome-terminal -- bash -c "./launch.sh; exec bash"
gnome-terminal -- bash -c "docker run -it --net='host' -v '~/Event Apps/NewDashBoard/backend':/home/backend osrf/ros:noetic-desktop-full; exec bash"
