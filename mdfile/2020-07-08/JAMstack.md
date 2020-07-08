# JAM Stack 개념 정리하기
SSR 도입위해 NextJS 를 검토하던중 JAM Stack 개념을 알게되어 이를 정리 해보고자 한다. <br />

[JAMstack WTF](https://jamstack.wtf/)

**JAM stack** 은 **Javascript, Api, Markup Stack** 의 약자이다. <br />
약자에서 알수 있듯 <code>Javascript</code> 와 <code>API</code> 그리고 <code>Markup(HTML)</code> 만으로 이루어진 웹의 구성을 이야기하는 것인데, 우리가 알고 있는 SPA 과는 비슷하지만 다르다. <br />

## SPA (Single Page Application) 와 CSR (Client Side Rendering)

웹은 보통 완성된 <code>Static HTML</code> 와 <code>CSS</code> 를 네트워크로 전달 받아서, 화면을 보여준다. <br />

서버가 **동적**으로 **HTML**을 생성할 수 있게 되면서 **Server Side Rendering(SSR)** 개념이 등장하였고, **사용자의 요청** 에 따라 **HTML** 을 만들어서 전달하고, 화면을 보여줄 수 있게 되었다. <br />

**SSR** 만으로는 더 많은 **HTML** 의 조작이 힘들어 지면서, 보조역할만 하던 **Javascript** 가 **jQuery**의 만남과 함께, 중요한 역할을 차지하게 되었다.

**Javascript** 로 화면을 조작할 일이 많이 생겼고, <code>Javascript 와 브라우저 성능이 더욱 발전하여</code> <br />
<code>Angular.js, Angular, React, Vue</code> 와 같은 **DOM** 을 조작하기 쉽게 도와주는 라이브러리와 웹 프레임워크가 등장하면서, <code>Client Side Rendering(CSR)</code> 개념이 등장하게 되었다. <br />

시대가 발전하고 사용자의 환경이 더욱 발전하면서, 서버 상에서 **HTML** 을 만들어서 전달하는 것보다 **(SSR)**, <br />
클라이언트 상에서 **HTML** 을 만드는 것이 **(CSR)**, **서버 비용과 렌더링 속도**에서 훨씬 유리한 환경이 되게 되었다. <br />

페이지를 이동할 때마다 **HTML** 을 새로 받아서 그리는것보다, 필요한 데이터만 을 받아서 **Javascript** 로 화면을 그리는 것이 유리해지면서, <br />
<code>극단적으로 거의 정보가 없는 HTML</code> 과 <code>매우 큰 Javascript</code> 그리고, <code>분리된 환경의 API</code> 만으로 이루어진 **Single Page Application (SPA)** 환경이 이루어지게 된다. <br />

## 그럼에도, SSR 는 필요하다.
많은 장점을 가지고 있는 **SPA** 지만, 매우 큰 2가지 단점을 가지고 있는데, 사용자가 **첫 의미 있는 페이지** <code>(First meaningful paint)</code> 를 보게 되기까지, **SSR** 에 비해 오래 걸
리고,  <br />
검색 엔진이 이해할 수 있던 **HTML**이 사라지고, **Javascript**만 존재하게 되면서, **검색 엔진 최적화** <code>(Search Engine Optimization, SEO)</code> 를 맞추기가 어려워졌다. <br />

하지만, 그럼에도 **Javascript** 로 조작하는 환경은 매우 매력적이였고, 특히 <code>First meaningful paint</code> 와 <code>SEO</code>가 중요했던 개발자들은 **SSR** 과 **CSR** 혼합한 형태를 만들어 내게 되는데, <br /> 
**Javascript**에서 사용하는 환경을 그대로 이용한 **Server**인 <code>Angular Universal</code> 와 <code>NextJS</code> 그리고 <code>NuxtJS</code> 이 등장하게 된다. <br /> 

첫 페이지는 <code>SSR</code> 형태로 <code>HTML</code>을 만들어서 보여주고, 이후 **모든 화면 조작** 과 이후 **Rendering (CSR)** 을 <code>Javascript</code> 가 처리하게하는 하이브리드 형
태로 발전하게 된다. <br /> 

이로 써 첫 페이지는 완성된 **HTML**을 전달해주어, <code>First meaningful paint</code>의 속도를 높히고, 검색봇이 **HTML** 을 크롤링해서, <code>SEO</code> 를 대응할 수 있게 된다. <br /> 

## JAM Stack
**JAM Stack** 은 **React(CSR)** 와 **Next.js(SSR)** 같은 특정 기술로 구성된 형태를 이야기하는 것은 아니다. <br /> 
이들을 이용해서 **웹 사이트**를 어떻게 **구성** 할 것인지의 **관점** 에 대해서 이야기한다. <br /> 

<code>MEAN Stack</code> 이 <code>MongoDB</code>, <code>Express.js</code>, <code>Angular.js</code>, <code>Node.js</code> 같은 특정 기술로 이루어진 방법이라면, <br />
**JAM Stack** 은 <code>Javascript</code> 와 <code>API</code> 그리고 <code>Markup</code> 으로 구성된 최신 웹 사이트를 구성하는 방법을 이야기한다. <br />

> ### JavaScript
> **Client**의 모든 처리는 **Javascript** 에게 맡긴다.
> ### API
> 모든 기능 및 비즈니스 로직은 재사용 가능한 API 로 추상화한다.
> ### Markup
> **SSG (Static Site Generator)** 나 **Template Engine (Webpack 등)** 을 이용하여 Markup 을 미리 생성한다.

여기에서 제일 중요 부분이 **Markup** 이다. <br />

## Markup
세상에는 정말 다양한 **Markup** 을 만들수 있는 방법이 존재한다. <br />

**HTML**을 직접 작성하거나, [Template Engine](https://en.wikipedia.org/wiki/Comparison_of_web_template_engines) 같은 툴을 이용하거나, <code>Jekyll (ruby), Hugo (go), Nuxt (vue), 
Next (react), Gatsby</code> **같은 정적 사이트 생성기**<code>(Static Site Generator, SSG)</code>를 이용해서, **Static HTML** 을 생성할 수도 있다. <br />

그리고 미리 작성된 <code>Static HTML</code> 은 웹서버의 리소스를 쓸 필요 없이, 사용자에게 **HTML** 만을 전달 해주면 된다. <br />

이는 매우 큰 장점을 가져오게 되는데, **Static HTML** 을 <code>CDN</code> 을 통해 <code>Cache</code> 하고 배포하여, **빠른 속도**를 유지한다. <br />

따로 동적으로 **HTML** 을 생성하지 않기 때문에, 따로 웹서버가 필요 없어 **서버 비용**이 높지 않다. <br />
하지만 모든 **HTML** 이 **Static HTML** 만으로 이루어진 것을 뜻하지는 않는다. <br />
모든 **Markup** 을 정적 으로 유지하게 되면, 최신 데이터를 유지하기 어렵기 때문이다. <br />
중요한 것은 최대한 **HTML Build** 을 빌드하여, <code>Cache</code> 하고 사용자를 위한 <code>First meaningful paint</code> 의 속도를 높히자는 점이다. <br />

## 간단한 JAM Stack 과정
**JAM Stack** 을 가장 쉽게 따라해볼 수 있는 방법은 <code>gatsbyjs</code> 와 <code>netlify</code> 를 이용해 웹사이트를 구축하는 것이다. <br />

[Gatsby 로 Blog 만들기](https://medium.com/@pks2974/gatsby-%EB%A1%9C-blog-%EB%A7%8C%EB%93%A4%EA%B8%B0-ac3eed48e068) <br />

<code>gatsbyjs</code> 는 **React** 와 **GraphQL** 를 이용한 **정적 사이트 생성기**다. <br />
<code>netlify</code> 는 **Javascript** 코드를 **빌드** 하고 **배포** 하고 운영할 수 있게 도와주는 **플랫폼**이다. <br />

> 1. Github 으로 프로젝트를 관리한다.
> 2. Gatsbyjs (SSG) 로 정적 사이트 생성기를 구축한다.
> 3. Netlify 에 배포 환경을 구성한다.
> 4. GitHub 에 코드가 변경되면, Netlify 에서 빌드를 시작한다.
> 5. Netlify 로 Gatsbyjs 으로 빌드하고, 사이트을 배포한다.

한번 배포된 **Package** 는 더 이상 빌드를 위한 웹서버의 자원은 필요하지 않게되고, 모든 처리는 **Javascript** 와 **API** 에서 이루어지게 된다. <br />

**JAMStack** 은 하나의 개념이기 때문에, 특정 라이브러리나 플랫폼을 이용하지 않고, 본인이 직접 빌드툴 혹은 프레임워크을 만들거나, 호스팅 서버나 **CDN** 을 운영해도 전혀 문제가 없다. <br />

## 마치며
**JAM Stack** 은 새로운 개념이 아니다. <br >
이전부터 많은 개발자들이 고민하면서 알게 모르게, 성능과 유저 그리고 동료들을 위해서 노력했던 과정들의 산물이다. <br />
**JAM Stack** 은 이렇게 하면 편하고, 빠르고, 멋진 경험을 하면서, 개발할 수 있다는 하나의 지침이다. <br />
**SSR** 을 위한 **Nextjs** 를 도입하려고 찾아보던 중 **JAM Stack** 이라는 방향성 을 만나게 되어 기쁘기 그지없다. <br />
**Nextjs** 와 **S3** 그리고 **Cloud Front** 를 이용해 **JAM Stack** 을 적용해 볼 수 있기를 기대해 본다. <br />

## 참고 URL
### JAM Stack 을 위한 여러 도구를 설명한다.
> https://www.thenewdynamic.org/
> https://www.staticgen.com/
> https://headlesscms.org/

### JAM Stack 을 더 자세히 설명하는 글이다.
> https://jamstack.org/
> https://www.netlify.com/jamstack/
> https://www.gatsbyjs.org/docs/glossary/jamstack/
[자료](https://medium.com/@pks2974/jam-stack-%EA%B0%9C%EB%85%90-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-17dd5c34edf7)
