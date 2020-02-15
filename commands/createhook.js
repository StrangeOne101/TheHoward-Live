return;

channel.createWebhook("T̜̂ͫ̈́̀ͥ̒ŏ͍ͦ̅ͧͥͨb͔̝̮̟̟͋y͚͇̐̈́̊̄", "https://cdn.discordapp.com/avatars/145436402107154433/83bcc5b3f528cbc542d88666f8cf4de5.png?size=2048", "Spoiler Webhook")
	.then(webhook => webhook.edit("T̜̂ͫ̈́̀ͥ̒ŏ͍ͦ̅ͧͥͨb͔̝̮̟̟͋y͚͇̐̈́̊̄", "https://cdn.discordapp.com/avatars/145436402107154433/83bcc5b3f528cbc542d88666f8cf4de5.png?size=2048"))     //Because it doesn't create correctly, we have
	.then(webhook => {
		webhook.send("Testing again");
		send(`Webhook created at: https://canary.discordapp.com/api/webhooks/${webhook.id}/${webhook.token}`);
	})  //to set the details again
	.catch(error => console.log(error));