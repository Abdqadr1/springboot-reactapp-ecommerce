import { Tabs, Tab, Card, Button } from "react-bootstrap";
import "../css/sales_report.css";
import { useState, useEffect, useCallback,useMemo, useRef } from "react";
import { SPINNERS_BORDER, SPINNERS_BORDER_HTML, isTokenExpired, formatPrice} from "./utilities";
import axios from "axios";
import useAuth from "./custom_hooks/use-auth";
import { useNavigate } from "react-router";
import useSettings from "./custom_hooks/use-settings";
import { Chart } from "react-google-charts";
import CustomToast from "./custom_toast";
const SalesReport = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState({date: "", category: "", product: ""});
    const [divisor, setDivisor] = useState(7);
    const [chartTitles, setChartTitles] = useState({date: "", category: "", product: ""});
    const [isLoading, setLoading] = useState(false);
    const [toast, setToast] = useState({show:false, message: "", variant: "dark"});
    const firstBtn = useRef();
    const [filterType, setFilterType] = useState("date")
    const [customDates, setCustomDates] = useState({start: "", end: ""})
    const [data, setData] = useState({date: [], category: [], product: []});
    const headers = ["Total Gross Sales:", "Total Net Sales:", "Avg. Gross Sales:", "Avg. Net Sales:", "Total Products:"]
    const [{ accessToken }] = useAuth();
    const dayInMilliSeconds = 1000 * 60 * 60 * 24;
    const abortController = new AbortController();
    const settings = useSettings();
    const priceFormatter = useCallback((price) => {
        const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE } = settings;
        return formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION);
    }, [settings]);

    const numberFormatter = useMemo(() => {
        const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, DECIMAL_POINT_TYPE } = settings;
        return {
                    prefix: CURRENCY_SYMBOL_POSITION === "BEFORE PRICE" ?  CURRENCY_SYMBOL : "",
                    suffix: CURRENCY_SYMBOL_POSITION === "AFTER PRICE" ?  CURRENCY_SYMBOL : "",
                    decimalSymbol: DECIMAL_POINT_TYPE === "POINT" ? ".": ",",
                    groupingSymbol: THOUSANDS_POINT_TYPE === "POINT" ? "." : ",",
                    fractionDigits: DECIMAL_DIGIT,
                }
        
    }, [settings])

    const changePage = useCallback(function (button, filter, divisor, abortController, title, uri) {
        const url = process.env.REACT_APP_SERVER_URL + "sales_report/";
        const text = button.textContent;
        button.disabled = true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.get(`${url}${uri}/${filter}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                signal: abortController.signal
            }
        })
            .then(response => {
                const result = response.data
                // console.log(result);
                setDivisor(divisor);
                setData(s => ({...s, [filterType]: result}));
                setChartTitles(s => ({...s, [filterType] : "Sales in " + title}));
            })
            .catch(error => {
                const response = error.response;
                let message = "An error ocurred";
                if (response) {
                    message = response.data.message;
                    (isTokenExpired(response))  && navigate("/login/2");
                }
                setToast(s=> ({...s, show:true, message}))
            })
            .finally(() => {
                setLoading(false);
                button.disabled = false;
                button.textContent = text;
            })
    }, [accessToken, navigate, filterType]);

    const total = useMemo(() => {
        const total_s = {
            date: [0.0, 0.0, 0.0, 0.0, 0],
            category: [0.0, 0.0, 0.0, 0.0, 0],
            product: [0.0, 0.0, 0.0, 0.0, 0]
        }
        const array = total_s[filterType];
        data[filterType].forEach(item => {
            array[0] = array[0] + item.grossSales;
            array[1] = array[1] + item.netSales;
            array[4] = array[4] + (filterType === "date" ? item.ordersCount : item.productCount);
        });
        array[2] = array[0] / divisor;
        array[3] = array[1] / divisor;
        return total_s;
    }, [data, divisor, filterType]);

    const chartData = useMemo(() => {
        return {
            date: [
                [
                    { label: 'Date', type: 'string' }, { label: 'Gross Sales', type: 'number' },
                    { label: 'Net Sales', type: 'number' }, { label: 'Orders Count', type: 'number' }
                ],
                ...data.date.map(item => [item.identifier, item.grossSales, item.netSales, item.ordersCount])
            ],
            category: [
                [
                    { label: 'Category', type: 'string' }, { label: 'Gross Sales', type: 'number' },
                    { label: 'Net Sales', type: 'number' }, { label: 'Product Count', type: 'number' }
                ],
                ...data.category.map(item => [item.identifier, item.grossSales, item.netSales, item.productCount])
            ],
            product: [
                [
                    { label: 'Product', type: 'string' }, { label: 'Gross Sales', type: 'number' },
                    { label: 'Net Sales', type: 'number' }, { label: 'Orders Count', type: 'number' }
                ],
                ...data.product.map(item => [item.identifier, item.grossSales, item.netSales, item.productCount])
            ]
        }
    }, [data])

    const chartOptions = {
            height: 360,
            page: "enable",
            sortColumn: 1,
            sortAscending: false,
            showRowNumber: true,
            width: "95%",
            bar: {groupWidth: "95%"},
            legend: { position: "top" },
            series: {
                0: { targetAxisIndex: 0 }, // Bind series 0 to an axis named 'distance'.
                1: { targetAxisIndex: 0 }, // Bind series 1 to an targetAxisIndex named 1.
                2: { targetAxisIndex: 1 } // Bind series 1 to an axis named 'brightness'.
            },
            vAxes: {
                0: { title: "Sales Amount", format: "currency" },
                1: { title: "Number of Orders"},
            }
        }


    useEffect(()=>{document.title = `Orders - ${settings.SITE_NAME}`},[settings.SITE_NAME])

    useEffect(() => {
        return () => {
            console.log("cleaning up...")
            abortController.abort()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleToggle = e => {
        const target = e.target;
        const id = target.id;
        let uri = target.getAttribute("data-uri");
        const newId = (uri === "date") ? id : filterType + "/" + id;
        uri = (uri === "date") ? "by_date" : "by_group";
        const divisor = Number(target.getAttribute('data-divisor'));
        if (id !== "custom_range") {
            const title = id.split("_").join(" ");
            changePage(target, newId, divisor, abortController, title, uri);
        }
        setFilter(s=>({...s, [filterType] : id}));
    }
    const handleDateChange = e => {
        const id = e.target.id;
        const value = e.target.value;
        setCustomDates(s => ({...s, [id]: value}))
    }
    const handleViewData = e => {
        e.preventDefault();
        const target = e.target;
        const input = target.parentElement.querySelector("input");
        input.setCustomValidity("");
        const startDate = new Date(customDates.start), endDate = new Date(customDates.end);
        const diff = (endDate - startDate) / dayInMilliSeconds;
        const path = customDates.start + "/" + customDates.end;
        let uri = target.getAttribute("data-uri");
        uri = (uri === "date") ? "by_date" : filterType;
        if (diff >= 7 && diff <= 30) {
            const title = `the date range ${customDates.start} to ${customDates.end}`;
            changePage(target, path, diff, abortController, title, uri);
        } else {
            input.setCustomValidity("Dates must be in the range of 7-30 days.");
            input.reportValidity();
        }
    }
    const changeFilterType = e => setFilterType(e);

    const listButtons = (uri, type) => {
        return (
            <>
            <div className="d-flex justify-content-start align-items-center p-3 gap">
                <Button ref={firstBtn} data-uri ={uri} data-divisor="7" className="filter" 
                        onClick={handleToggle} id="last_7_days" 
                        variant={(filter[type] === 'last_7_days') ? "primary" : "light"}>
                        Last 7 Days
                </Button>
                <Button data-uri ={uri} data-divisor="28" className="filter" 
                    onClick={handleToggle} id="last_28_days" 
                    variant={(filter[type]=== 'last_28_days') ? "primary" : "light"}>
                    Last 28 Days
                    </Button>
                <Button data-uri ={uri} data-divisor="6" className="filter" 
                    onClick={handleToggle} id="last_6_months" 
                    variant={(filter[type]=== 'last_6_months') ? "primary" : "light"}>
                    Last 6 Months
                    </Button>
                <Button data-uri ={uri} data-divisor="12" className="filter" 
                    onClick={handleToggle} id="last_year" 
                    variant={(filter[type]=== 'last_year') ? "primary" : "light"}>
                    Last  Year
                    </Button>
                <Button className="filter" onClick={handleToggle} id="custom_range"
                        variant={(filter[type] === 'custom_range') ? "primary" : "light"}>
                        Custom Date Range
                </Button>
            </div>
            {
                (filter[type] === 'custom_range') && 
                <div  className="d-flex justify-content-start align-items-center p-3 gap">
                    <input className="p-2 rounded" required type="date" value={customDates.start} onChange={handleDateChange} id="start"/>
                    <span>&nbsp; to &nbsp; </span>
                    <input className="p-2 rounded" required type="date" value={customDates.end} onChange={handleDateChange} id="end" />
                    <Button data-uri ={uri} variant="secondary" onClick={handleViewData}>View Data</Button>
                </div>
            }

            </>
        )
    }

    const onLoad = e => {
        // console.log("loading...", e);
        // e.setOnLoadCallback(
        //      function () {
        //         setLoading(true);
        //         const id = filter[filterType];
        //         const title = id.split("_").join(" ");
        //         changePage(firstBtn.current, id, divisor, abortController, title, "by_date");
        //     }
        // ) 
    }


    return ( 
        
         <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "40vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    :
                     <>
                    <div className="p-3">
                        <Tabs defaultActiveKey="date" id="uncontrolled-tab-example" className="" onSelect={changeFilterType}>
                                
                            <Tab title="Sale by Date" eventKey="date">
                                {listButtons("date",  "date")}
                                {
                                    (filterType === "date") && 
                                    <div>
                                        <Chart
                                            onLoad={onLoad}
                                            chartType="ColumnChart"
                                            data={chartData.date}
                                            options={{
                                                title: chartTitles.date,
                                                ...chartOptions
                                            }}
                                            graphID="ColumnChart"
                                            width="100%"
                                            height="400px"
                                            formatters={[
                                                {
                                                    type: "NumberFormat",
                                                    column: 1,
                                                    options: numberFormatter
                                                }
                                            ]}
                                        />
                                    </div>
                                }
                                <div className="d-flex justify-content-center align-items-center p-3">
                                    {
                                        headers.map((h, i) => <Card key={h} className="text-start my-2">
                                                        <Card.Header className="p-2 fw-bold">{i!==4 ? h : 'Total Orders'}</Card.Header>
                                                        <Card.Body className="p-3">{i===4 ? total.date[i] : priceFormatter(total.date[i])}</Card.Body>
                                                    </Card>)
                                    }
                                </div>
                            </Tab>
                            <Tab title="Sales by Category" eventKey="category">
                                {listButtons("by_group", "category")}
                                {
                                    (filterType === "category") && 
                                    <div>
                                        <Chart
                                            className="mx-auto"
                                            chartType="PieChart"
                                            data={chartData.category}
                                            options={{
                                                title: chartTitles.category,
                                                ...chartOptions,
                                                legend: { position: "right" },
                                            }}
                                            graphID="PieChart"
                                            width="100%"
                                            height="400px"
                                            formatters={[
                                                {
                                                    type: "NumberFormat",
                                                    column: 1,
                                                    options: numberFormatter
                                                    }
                                                ]}
                                        />
                                    </div>
                                }
                                <div className="d-flex justify-content-center align-items-center p-3">
                                    {
                                        headers.map((h, i) => <Card key={h} className="text-start my-2">
                                                        <Card.Header className="p-2 fw-bold">{h}</Card.Header>
                                                        <Card.Body className="p-3">{i===4 ? total.category[i] : priceFormatter(total.category[i])}</Card.Body>
                                                    </Card>)
                                    }
                                </div>
                            </Tab>
                            <Tab title="Sales by Product" eventKey="product">
                                {listButtons("by_group", "product")}
                                {
                                    (filterType === "product") && 
                                    <div>
                                        <Chart
                                            className="mx-auto"
                                            chartType="Table"
                                            data={chartData.product}
                                            options={{
                                                title: chartTitles.product,
                                                ...chartOptions
                                            }}
                                            graphID="Table"
                                            width="100%"
                                            height="400px"
                                            formatters={[
                                                {
                                                    type: "NumberFormat",
                                                    column: 1,
                                                    options: numberFormatter
                                                }, 
                                                {
                                                    type: "NumberFormat",
                                                    column: 2,
                                                    options: numberFormatter
                                                }
                                            ]}
                                        />
                                    </div>
                                }
                                <div className="d-flex justify-content-center align-items-center p-3">
                                    {
                                        headers.map((h, i) => <Card key={h} className="text-start my-2">
                                                        <Card.Header className="p-2 fw-bold">{h}</Card.Header>
                                                        <Card.Body className="p-3">{i===4 ? total.product[i] : priceFormatter(total.product[i])}</Card.Body>
                                                    </Card>)
                                    }
                                </div>
                            </Tab>
                        </Tabs> 
                    </div>
                    
                </> 
            }
            <CustomToast {...toast} setToast={setToast} />
        </>
       
     );
}
 
export default SalesReport;