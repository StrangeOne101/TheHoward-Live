var message_ban_channels = []//["329546144143376384", "463855196829909002"];

/*var urlPattern = new RegExp('^(https?:\/\/)?'+ 
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ 
    '((\d{1,3}\.){3}\d{1,3}))'+ 
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ 
    '(\?[;&a-z\d%_.~+=-]*)?'+ 
    '(\#[-a-z\d_]*)?$','i'); */

if (message_ban_channels.indexOf(channel.id) != -1 && (msgobj.attachments.array().length == 0)) {
    msgobj.delete().then(() => {
		sender.send("You can only send images in this channel right now");
	}).catch(() => {
		reply("Please only send images in this channel. Text is not allowed right now");
	});
}