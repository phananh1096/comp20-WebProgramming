#!/bin/bash
#running a while loop that continously inserts into db

while :
do
	echo "inserting pa_test into server"
	curl --data "username=thisisinfinite&score=88&grid={}" https://gameserver2048.herokuapp.com/submit
done