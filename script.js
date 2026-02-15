function boostApp(appId) {

    if (!appId) {
        alert("App ID missing!");
        return;
    }

    var options = {
        key: "rzp_test_XXXXXXXXXXXX", // 👈 Yaha apni Razorpay Key dalo
        amount: 19900, // 199 INR (amount paise me hota hai)
        currency: "INR",
        name: "Bharat App Store",
        description: "1 Month Boost",
        image: "https://ingpv111-star.github.io/-bharat-app-store/logo.png", // optional logo

        handler: function (response) {

            if (response.razorpay_payment_id) {

                alert("✅ Payment Successful!\nPayment ID: " + response.razorpay_payment_id);

                // Yaha aap boost activate kar sakte ho
                localStorage.setItem("boost_" + appId, true);

                location.reload();
            }
        },

        prefill: {
            name: "",
            email: "",
            contact: ""
        },

        theme: {
            color: "#3399cc"
        }
    };

    var rzp = new Razorpay(options);
    rzp.open();
}
