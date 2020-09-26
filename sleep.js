class sleep{
	async sleep(time){
		console.log(`now to sleep ${time}ms`);
		return new Promise( next=> {
			setTimeout(()=> {
				next();
			}, time);
		})
	};
}
module.exports = new sleep();