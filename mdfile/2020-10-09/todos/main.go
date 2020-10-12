package main

import (
	"log"
	"net/http"
	"os"

	"changbeomWeb/todos/app"
)

func main() {
	port := os.Getenv("PORT")
	m := app.MakeHandler("postgres://qnmjybcfgmquar:2b87c590348614ffbd08e4186384d5c4bad4e9bbf9a01ab18258d2c542157df1@ec2-52-73-199-211.compute-1.amazonaws.com:5432/d37t9aspom7fa7")
	defer m.Close()

	log.Println("Started App" + port)
	err := http.ListenAndServe(":"+port, m)
	if err != nil {
		panic(err)
	}
}
