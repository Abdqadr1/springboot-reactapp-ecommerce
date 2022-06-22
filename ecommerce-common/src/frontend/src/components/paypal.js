import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Spinner } from "react-bootstrap";
const Paypal = ({ info:object, setToast, successHandler }) => {
    const { info, customer } = object;
    // console.log(info)
    const [{ isPending, isRejected }] = usePayPalScriptReducer();

    if (isRejected) {
        setToast(s => ({ ...s, show: true, message: "PayPal script could not loaded" }));
    }

    return (  
        <>
            {isPending &&
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            <PayPalButtons style={{ layout: "vertical" }} createOrder={(data, actions) => {
                return actions.order.create({
                        enableStandardCardFields : true,
                        intent: "CAPTURE",
                        payer: {
                            name: {
                                given_name: customer.firstName,
                                surname: customer.lastName
                            },
                                address: {
                                address_line_1: customer.mainAddress,
                                address_line_2: customer.extraAddress,
                                admin_area_1: customer.state,
                                admin_area_2: customer.city,
                                postal_code: customer.postalCode,
                                country_code: customer.country.code,
                            },
                            email_address: customer.email,
                            phone: {
                                phone_type: "MOBILE",
                                phone_number: {
                                    national_number: customer.phoneNumber
                                }
                            }
                        },
                        purchase_units: [
                            {
                                amount: {
                                    value: info.paymentForPayPal,
                                    currency_code: info.total
                                },
                            },
                        ],
                        application_context: {
                                shipping_preference: 'NO_SHIPPING'
                        }
                    }).then(orderId=> {
                        return orderId
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        // const name = details.payer.name.given_name;
                        const id = details.id;
                        // const amount = details.purchase_units[0].amount.value;
                        const data = new FormData();
                        data.set("orderId", id)
                        successHandler(data, "paypal_order");
                    });
                }} 
                onCancel={(data) => {
                    setToast(s=> ({...s, show:true, message: "You canceled the transaction"}))
                }}

                onError={(error) => {
                    console.log("An error occurred", error);
                    setToast(s => ({ ...s, show: true, message: "An error occurred" }))
                }}

                />
        </>
    );
}
 
export default Paypal;