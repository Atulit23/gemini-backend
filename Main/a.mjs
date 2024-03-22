// import axios from 'axios'

// axios.post("https://review-and-ads.vercel.app/text-interference", {text: 'to use paid aspects of the service, you agree to our pricing and payment terms as we may update them from time to time. render may add new services for additional fees and charges, add or amend fees and charges for existing services, at any time in its sole discretion. any change to our pricing or payment terms shall become effective in the billing cycle following notice of such change to you as provided in this agreement. we use stripe as our third-party service provider for payment services. by using our service, you agree to be bound by stripe’s services agreement available at https://stripe.com/us/legal.no refunds. you may cancel your user account at any time; however, there are no refunds for cancellation. in the event that render suspends or terminates your user account or this agreement, you understand and agree that you shall receive no refund or exchange for any render property, any unused time on a subscription, any license or subscription fees for any portion of the service, any content or data associated with your user account, or for anything else. you are solely responsible for exporting your user content from the service prior to termination of your account for any reason.payment information. taxes. all information that you provide in connection with a purchase or transaction or other monetary transaction interaction with the service must be accurate, complete, and current. you agree to pay all charges incurred by users of your credit card, debit card, or other payment method used in connection with a purchase or transaction or other monetary transaction interaction with the service at the prices in effect. Are the terms of cancellation clear ? Answer in yes or no.'}).then(res => {
//     console.log(res.data)
// }).catch(err => {
//     console.log(err)
// })

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
    console.log(response)
	const result = await response.json();
	return result;
}

query({"inputs": "How to stop pest control?"}).then((response) => {
	console.log(JSON.stringify(response));
});