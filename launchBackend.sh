echo 246810 | sudo -S ufw allow 8001
sudo ufw allow 9090
sudo ufw allow 9876
sudo ufw allow 5173
docker run -it --net='host' -e USER=$USER -v /home/$USER/Desktop/points:/home/$USER/Desktop/points -v '/home/abdelrahman/Event Apps/NewDashBoard':/home/backend newdashboard:latest; exec bash
