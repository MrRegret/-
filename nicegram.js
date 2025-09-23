> Loon 适配版本

***********************************/

// Loon HTTP Response 脚本处理
var body = $response.body.replace(/subscription":\w+/g, 'subscription":true');

$done({
    body: body
});
