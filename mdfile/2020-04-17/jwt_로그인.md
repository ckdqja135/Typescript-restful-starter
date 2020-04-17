Web에서 로그인을 구현하는 방법에는 여러 가지가 있습니다.  <br />
일반적으로 Session과 Cookie를 통한 로그인 구현 방식을 떠올릴 수 있는데요. <br />
JWT는 앞의 두 가지와 약간 다른 것으로 최근에 많이 사용되는 인증(Authentication) 방법 중 하나 입니다. <br />
특히 Web Application이나 Mobile Application에서 사용자 인증하기 편한 방법으로 많은 서비스에서 사용하고 있습니다. <br />
JWT가 무엇인지 아래에서 알아보겠습니다. <br />

# JWT란 무엇입니까?

JSON Web Token (JWT)은 JSON 객체로서 당사자간에 안전하게 정보를 전송할 수있는 작고 독립적 인 방법을 정의 하는 공개 표준 ( RFC 7519 )입니다. <br />
이 정보는 디지털로 서명 되었기 때문에 검증되고 신뢰할 수 있습니다. <br />
JWT는 RSA 또는 ECDSA를 사용하는 비밀 (HMAC 알고리즘 사용) 또는 공용 / 개인 키 쌍을 사용하여 서명 할 수 있습니다.<br />
JWT는 당사자 간의 비밀 유지를 위해 암호화 될 수 있지만 서명 된 토큰에 중점을 둘 것 입니다. <br />
서명 된 토큰은 그 안에 포함 된 클레임 의 무결성 을 검증 할 수 있지만 암호화 된 토큰 은 다른 당사자의 클레임을 숨깁니다. <br />
토큰이 공용 / 개인 키 쌍을 사용하여 서명 된 경우, 서명은 개인 키를 보유한 당사자 만 서명 한 것임을 증명합니다.<br />

따라서 위 서비스는 작고 안전한 방법으로 정보를 전송할 수 있습니다. <br />
또한 서명된 토큰에 중점을 두어서 비밀 유지를 할 수도 있습니다. <br />
따라서 그 토큰이 중심이 되고 때로는 토큰 자체가 위 기능을 수행할 수도 있습니다. <br />
이게 핵심 부분입니다.<br />

# JWT를 언제 사용해야 합니까?
* Authorization
JWT를 사용하는 가장 일반적인 시나리오입니다. <br />
사용자가 로그인하면 각 후속 요청에 JWT가 포함되어 사용자가 해당 토큰으로 허용되는 경로, 서비스 및 리소스에 액세스 할 수 있습니다. <br /> 
싱글 사인온 (Single Sign On)은 오버 헤드가 적고 다른 도메인에서 쉽게 사용할 수 있기 때문에 요즘 JWT를 널리 사용하는 기능입니다. <br />

* Information Exchange
JSON Web Token은 당사자간에 정보를 안전하게 전송하는 좋은 방법입니다. <br />
JWT는 서명 할 수 있기 때문에 (예 : 공개 키 / 개인 키 쌍을 사용하여) 발신자가 자신이 말하는 사람인지 확인할 수 있습니다. <br />
또한 서명이 헤더와 페이로드를 사용하여 계산되므로 내용이 변조되지 않았는지 확인할 수도 있습니다. <br />

우리는 Authorization을 활용해서 로그인을 구현할 것입니다. <br />
하지만 로그인(인증된) 상태에서만 정보 교환을 할 수 있게 할 것입니다. 이것이 JWT Token을 사용하는 이유입니다. <br />

기본적으로 Typescript를 활용할 것입니다. Express라는 것을 사용해서 간단하게 REST API를 구현할 것입니다. <br />
또한 sequelize를 통해서 간단하게 RDBMS ORM을 구현할 것입니다.<br />

```typescript

     import * as express from 'express';
                import * as bodyParser from 'body-parser';
                import * as errorhandler from 'strong-error-handler';
                
                import { Routes } from "./routes/routes";
                
                class App {
                
                  public app: express.Application;
                  public routes: Routes = new Routes();
                
                  constructor() {
                      this.app = express(); 
                      this.config();
                      this.routes.routes(this.app);
                      this.errorHandler();
                  }
                
                  private config(): void{
                 
                      this.app.use(bodyParser.json({limit: '5mb'}));
                      this.app.use(bodyParser.urlencoded({extended: true}));
                  }
                  
                  private errorHandler(): void {
                      this.app.use(errorhandler({
                          debug: process.env.ENV !== 'prod',
                          log: true,
                      }));
                  } 
                }
                
                export default new App().app;

```

Express에서 기본적으로 해야 하는 작업은 BodyParser와 Error Handling입니다. <br />
이 부분은 제가 설명하기엔 주제에 맞지 않으니 찾아보시면 좋을 것 같습니다. 이렇게 App 객체를 만들고 실행이 되게 합니다. <br />

```typescript
  
      import {createServer} from 'http';
                import app from './app';
                import {sequelize} from './sequelize';

                const port = process.env.PORT || 7000;

                (async () => {
                await sequelize.sync({force: true});

                createServer(app)
                    .listen(
                    port,
                    () => console.info(`Server running on port ${port}`)
                    );
                })();

```

이 부분은 App을 createServer를 통해 실행시키는 과정입니다. <br />
그렇게 되면 7000번 포트에서 우리의 REST API Application이 열리게 됩니다. <br />
Express와 Node의 HTTP를 사용하면 이렇게 간단하게 HTTP Application을 작동시킬 수 있습니다. <br />
여기서 sequelize를 실행 시키는 과정이 있는데 이것은 RDBMS ORM을 사용하기 위해서 입니다. 해당 설정 파일 등록은 <br />

```typescript

   import {Sequelize} from 'sequelize-typescript';

            export const sequelize = new Sequelize({
                dialect: 'mysql',
                operatorsAliases: Sequelize.Op as any,
                database: 'test',
                username: 'root',
                password: '1234',
                modelPaths: [__dirname + '/models']
            });

```

위와 같이 합니다. 저 설정파일은 model들을 modelPaths에 찾아다가 사용할 수 있도록 등록합니다. <br />
그리고 그 외에 다른 것들은 Database와 관련된 설정파일입니다. <br />

바로 Model과 관련된 처리를 확인하겠습니다. Model에서 한 Class의 객체는 Database의 Table와 대응이 됩니다. <br />
그것이 ORM을 사용하는 것입니다. 하지만 여기서는 다루는 주제가 아니므로 간단히 넘어가겠습니다. 다음에 다룰 기회가 있으면 좋겠군요. <br />

```typescript
  
       import * as crypto from 'crypto';
            import {Table, Column, Model, DataType, PrimaryKey, BeforeCreate, CreatedAt, UpdatedAt, AllowNull, AutoIncrement} from 'sequelize-typescript';
            
            @Table
            export class User extends Model {
            
                @PrimaryKey
                @AutoIncrement
                @Column(DataType.BIGINT)
                id: number;
            
                @AllowNull(false)
                @Column(DataType.STRING)
                name: string;
            
                @PrimaryKey
                @AllowNull(false)
                @Column(DataType.STRING)
                email: string;
            
                @AllowNull(false)
                @Column(DataType.STRING)
                password: string;
            
                @Column(DataType.STRING)
                salt: string;
            
                @CreatedAt
                created: Date;
                
                @UpdatedAt
                updated: Date;
            
                getName(): string {
                    return this.name;
                }
            
                setName(value: string): void {
                    this.name = value;
                }
            
                getId(): number {
                    return this.id;
                }
            
                getPassword(): string {
                    return this.password;
                }                
        
```

여기서는 Typescript의 Decorator의 힘을 빌렸습니다. <br />
Typescript의 Decorator는 Java의 Annotation과 비슷한 형태를 가지고 있습니다만 사실 Python의 Decorator와 상당히 흡사합니다.  <br />
간단하게 설명하면 코드를 장식해주는 역할을 하는 것이며 형태는 함수로 되어 있습니다. <br />
여기서 Class의 Field와 Database의 Column과 대칭이 됩니다.  <br />
따라서 id[PK], name, email, password, created, updated를 가진 User Table이 Databse에 매칭이 됩니다. <br />
 
```typescript

              /**
            * Authenticate - password 체크
            *
            * @param {String} password
            * @param {Function} callback
            * @return {Boolean}
            * @api public
            */
                authenticate(password: string): boolean {

                    return this.getPassword() === this.encryptPassword(password).toString();
                }

            /**
            * Make salt - db에 저장
            *
            * @param {Number} byteSize Optional salt byte size, default to 16
            * @param {Function} callback
            * @return {String}
            * @api public
            */

                static makeSalt(byteSize: number): string {

                    const defaultByteSize: number = 16;

                    if (byteSize < 1) {
                        byteSize = defaultByteSize;
                    }

                    //if (!callback) { // 콜백 처리가 필요없다면
                        return crypto.randomBytes(byteSize).toString('hex');
                    //}
                    /*
                    return crypto.randomBytes(byteSize, (err: Error, salt: Buffer): void => { // 콜백 처리가 필요하다면
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, salt.toString('base64'));
                        }
                    });
                    */
                }

                /**
            * Encrypt password
            *
            * @param {String} password
            * @param {Function} callback
            * @return {String}
            * @api public
            */

                encryptPassword(password: string): string {
                        
                        const defaultIterations: number = 1000;
                        const defaultKeyLength: number = 64;
                        const saltedValue: Buffer = new Buffer(this.salt, 'base64');

                        //if (!callback) {
                            return crypto.pbkdf2Sync(password, saltedValue, defaultIterations, defaultKeyLength, 'sha512').toString('hex');
                        //}
                        //callback 처리
                }

                static validatePresenceOf(value: string): boolean {
                        return ( 0 < value.length );
                }

                @BeforeCreate
                static setEncryptForUser(instance: User): void {
                        
                        if (false == User.validatePresenceOf(instance.password)) {
                            return;
                            // 에러처리필요 
                        }
                        const saltedValue: string = User.makeSalt(0);
                        instance.salt = saltedValue;

                        const hashedPassword: string = instance.encryptPassword(instance.password);
                        instance.password = hashedPassword;
                }

            }                

```

여기서는 다른 사용자에게 유출이 되서는 안되는 데이터를 다루는 기술이 들어가 있습니다. <br />
사실 주제에 맞지는 않지만 간단히 설명을 하겠습니다. 다른 사용자에게 유출 되어서는 안되는 데이터를 나누는 기준에는 두 가지가 있습니다. <br />
하나는 데이터의 원본이 의미가 있는지와 다른 하나는 데이터의 원본이 의미가 없느냐 입니다. <br />
예를 들면 비밀번호는 데이터의 원본이 중요한 것이 아니라 그것이 어떤 상태이던 간에 기존의 기록과 일치하느냐 입니다. <br />
이러한 경우 우리는 데이터를 Hash를 통해 보관합니다. <br />
Hash는 단방향 암호화 이기 때문에 데이터를 원래의 상태로 복구할 수는 없지만 비밀번호가 지니는 가치, 즉 사용자 인증을 하는 데에는 문제가 없습니다. <br />
그래서 비밀번호는 Hash의 대상입니다. 여기서는 encryptPassword 함수를 통해 sha512로 암호화 하고 있습니다. <br />
기회가 되면 Hash Function의 종류에 대해서도 알아보면 좋겠군요.<br />
여기서 약간 생소한 것이 Salt라는 데이터 일 것입니다. <br />
Rainbow Table Attack과 같은, 미리 자주쓰이는 비밀번호를 여러 Hash 결과값으로 대입해서 Hash Function과 반대로 원본 값을 유추하는 공격에 대비하는 방법입니다. <br />
Salt를 사용함으로서 이러한 공격을 조금이나마 방해할 수 있습니다.<br />

```typescript
  
            import { Request, Response, NextFunction } from "express";
            import * as jwt from 'jsonwebtoken'
            ;
            import { User } from '../models/User';
            
            export async function createUser(req: Request, res: Response, next: NextFunction) {
                try {
                    const user = await User.create(req.body);
                    const token = jwt.sign({id: user.id, email : user.email, name : user.name}, 'signal', {
                        expiresIn : '2day'
                    });
                    res.status(201).json({
                        token,
                    });
                } catch(e) {
                    next(e);
                }
            }
            
            export async function loginUser(req: Request, res: Response, next: NextFunction) {
                try {
                    const {email, password} = req.body;
                    const user: User | null = await User.findOne({
                        where: {
                            email,
                        }
                    });
                    if ( ( user != null ) && ( user.authenticate(password) ) ) {
                        const token = jwt.sign({id: user.id, email : user.email, name : user.name}, 'signal', {
                            expiresIn : '2day'
                        });
                        res.json({
                            token,
                        })
                    }
                } catch(e) {
                    next(e);
                }
            }                

```

이 Controller에서는 Login와 CreateUser 관련된 일을 처리합니다. <br />
User가 Database에 Create되면 Token에 email, id, name을 넣어서 JWT Token을 만들고 임시로 만든 값을 통해 서명을 하게 됩니다. <br />
그러면 Client를 저 Token값을 받음으로서 내가 성공적으로 인증을 받았음을 알게 되는 것이죠. Login시에도 마찬가지입니다. <br />
email과 password를 통해 인증이 진행되는데 Database에서 해당 email을 가진 유저를 찾아서 password가 인증이 가능한지 확인하게 합니다. <br />

```typescript

  
            import {Request, Response} from "express";

            import {createUser, loginUser} from '../controllers/UserController';
             
            export class Routes {       
                public routes(app): void {
                    
                    app.route('/api/user')
                    .post(createUser)
                    app.route('/api/user/login')
                    .post(loginUser);
            
                    app.route('/')
                    .get((req: Request, res: Response) => {            
                        res.status(200).send({
                            message: 'main routes1'
                        })
                    })
                }
            }                

```

Route를 추가하면 이제 URL을 통해 HTTP Application과 통신할 수 있게 됩니다. <br />
이렇게 간단하게 JWT Token을 통해서 인증을 하는 HTTP Application을 작성할 수 있습니다. <br />
두번쨰는 다른 API에서 이 정보를 확인해서 내가 적절한 사용자가 맞음을 확인해야 합니다. <br />
이 과정은 Node의 Middleware를 통해서 할 수 있습니다. <br />

```typescript

    import * as express from 'express';
        import * as jwt from 'jsonwebtoken';
        import * as expressJwt from 'express-jwt';
        
        
        const validateJwt: expressJwt.RequestHandler = expressJwt({
            secret: 'signal', 
        });
        
        export function isAuthenticated() {
            
            return compose()
                .use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
                    if (req.query && req.query.hasOwnProperty('access_token')) {
                        req.headers.authorization = 'Bearer ' + req.query.access_token;
                    }
                    validateJwt(req, res, next);
                })
                .use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
                    // DB에서 필요한 데이터를 찾아서 req에 추가한다.
                })
        }
        
        export function signToken(id: string, name: string) {
            
            return jwt.sign({
                _id: id, 
                name: name,
            }, 'signal', { expiresIn: '2day'});
        }               
        
```

isAuthenticated 함수를 Middleware로 두게 되면 해당 함수가 URL의 Querystring 중 access_token 항목에서 Token을 찾아서 JWT가 적합한지 확인합니다. <br />
사실 HTTP Header에 넣는것과 Querystring에 넣는것은 별 차이는 없습니다. <br />
HTTP Header는 특수문자를 사용할 수 없고 Querystring은 URL에 직접적인 노출이 된다는 작은 차이점이 있지만 기능에는 전혀 문제가 없습니다. <br />
이러한 과정을 통해 올바른 사용자면 다음 단계를 진행 할 수 있게 됩니다. 하지만 잘못된 사용자인 경우 HTTP 403 Error를 반환하게 되죠. <br />

Typescript-Node와 각종 필요한 Library를 통해서 간단하게 JWT 기반의 인증 HTTP Application을 작성해 봤습니다. <br />
이 과정을 통해 간단하게 인증 서버를 구현할 수 있습니다. 그리고 Session이나 Cookie없이 Login을 구현할 수 있어요. <br />

# reference
> * [jwt문서](https://jwt.io/)
> * [jwt로그인](https://hodongman.github.io/2018/09/20/HTTP,JWT-JWT-Token-Login-by-Typescript-node.html)
> * [github](https://github.com/HodongMan/typescript-jwt-auth/)













