import * as cluster from "cluster";
import * as dotenv from "dotenv";
import { cpus } from "os";
import { resolve } from "path";
import { env } from "process";
import { config, isProduction } from "./config";
import { Server } from "./config/Server";

dotenv.config({ path: resolve() + "/.env" });
 //cpu갯수만큼 프로세스 실행 
if (cluster.isMaster) { // 초기에 서버를 실행하면 '마스터'라고 하는 프로세스 코드가 실행함.
    console.log(`\n -------------------> RUN ${env.NODE_ENV} ENVIRONMENT \n`);
    for (const _ of cpus()) {
        cluster.fork(); // fork()를 사용하여 프로세스 생성.
        if (!isProduction()) {
            break;
        }
    }
    // 워커가 죽으면
    cluster.on("exit", (worker, code, signal) => {
        console.log("Worker " + worker.process.pid + " died with code: " + code + ", and signal: " + signal);
        console.log("Starting a new worker");
        //서버가 죽었을시 프로세스 자동 추가 실행 또는 알아서 알람sms나 이메일등 모니터링 알람 처리
        cluster.fork();
    });
} else {
    // node.js의 포트를 설정한다. 여기서는 default를 3000 포트로 사용하고, 환경변수에 PORT라는 이름으로 포트명을 지정했을 경우에는 그 포트명을 사용하도록 한다.
    const port: number = Number(env.PORT) || config.PORT_APP || 3000;
    new Server().start().then((server) => {
        server.listen(port);
        server.on("error", (error: any) => { // 에러 처리
            if (error.syscall !== "listen") {
                throw error;
            }
            switch (error.code) {
                case "EACCES": // permission 문제.
                    console.error("Port requires elevated privileges");
                    process.exit(1);
                    break;
                case "EADDRINUSE": // 포트가 이미 사용중일 때.
                    console.error("Port is already in use");
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });
        server.on("listening", () => {
            console.log("Server is running in process " + process.pid + " listening on PORT " + port + "\n");
        });
    });
}
