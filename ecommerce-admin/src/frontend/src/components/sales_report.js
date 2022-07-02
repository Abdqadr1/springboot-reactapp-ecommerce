import { Tabs, Tab, Card, Button, Form } from "react-bootstrap";
import "../css/sales_report.css";
import { useState, useEffect, useCallback,useMemo } from "react";
import { SPINNERS_BORDER, SPINNERS_BORDER_HTML, isTokenExpired, formatPrice} from "./utilities";
import axios from "axios";
import useAuth from "./custom_hooks/use-auth";
import { useNavigate } from "react-router";
import useSettings from "./custom_hooks/use-settings";
import { Chart } from "react-google-charts";
const SalesReport = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const [divisor, setDivisor] = useState(7);
    const [chartTitle, setChartTitle] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [customDates, setCustomDates] = useState({start: "", end: ""})
    const [data, setData] = useState([]);
    const headers = ["Total Gross Sales:", "Total Net Sales:", "Avg. Gross Sales:", "Avg. Net Sales:", "Total Orders:"]
    const [{ accessToken }] = useAuth();
    const dayInMilliSeconds = 1000 * 60 * 60 * 24;
    const abortController = new AbortController();
         
    const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, SITE_NAME } = useSettings();
    
    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }

    const changePage = useCallback(function (button, filter, divisor, abortController, title) {
        const url = process.env.REACT_APP_SERVER_URL + "sales_report/";
        setLoading(true);
        const text = button.textContent;
        button.disabled = true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.get(`${url}by_date/${filter}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                signal: abortController.signal
            }
        })
            .then(response => {
                const result = response.data
                console.log(result);
                setDivisor(divisor);
                setData(result);
                setChartTitle("Sales in " + title);
            })
            .catch(error => {
                const response = error.response
                if (isTokenExpired(response)) navigate("/login/2")
            })
            .finally(() => {
                setLoading(false);
                button.disabled = false;
                button.textContent = text;
            })
    }, [accessToken, navigate]);

    const total = useMemo(() => {
        const array = [0.0, 0.0, 0.0, 0.0, 0];
        data.forEach(item => {
            array[0] = array[0] + item.grossSales;
            array[1] = array[1] + item.netSales;
            array[4] = array[4] + item.ordersCount;
        });
        array[2] = array[0] / divisor;
        array[3] = array[1] / divisor;
        return array;
    }, [data, divisor]);

    const chartData = useMemo(() => {
        const arr = [
            [
                { label: 'Date', type: 'string' }, { label: 'Gross Sales', type: 'number' },
                { label: 'Net Sales', type: 'number' }, { label: 'Orders Count', type: 'number' }
            ]
        ];
        data.forEach(item => arr.push([item.identifier, item.grossSales, item.netSales, item.ordersCount]));
        const options = {
            title: chartTitle,
            height: 360,
            // bar: {groupWidth: "95%"},
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
        };
        return [options, arr];
    },[data, chartTitle])


    useEffect(()=>{document.title = `Orders - ${SITE_NAME}`},[SITE_NAME])

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
        const divisor = Number(target.getAttribute('data-divisor'));
        if (id !== "custom_range") {
            const title = id.split("_").join(" ");
            changePage(target, id, divisor, abortController, title);
        }
        setFilter(id)
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
        if (diff >= 7 && diff <= 30) {
            const title = `the date range ${customDates.start} to ${customDates.end}`;
            changePage(target, path, diff, abortController, title);
        } else {
            input.setCustomValidity("Dates must be in the range of 7-30 days.");
            input.reportValidity();
        }
    }

    return ( 
        <>
            <div className="p-3">
                <Tabs defaultActiveKey="Sale by Date" id="uncontrolled-tab-example" className="">
                    <Tab eventKey="Sale by Date" title="Sale by Date">
                        <div className="d-flex justify-content-start align-items-center p-3 gap">
                            <Button data-divisor="7" className="filter" onClick={handleToggle} id="last_7_days" variant={filter=== 'last_7_days' ? "primary" : "light"}>Last 7 Days</Button>
                            <Button data-divisor="28" className="filter" onClick={handleToggle} id="last_28_days" variant={filter=== 'last_28_days' ? "primary" : "light"}>Last 28 Days</Button>
                            <Button data-divisor="6" className="filter" onClick={handleToggle} id="last_6_months" variant={filter=== 'last_6_months' ? "primary" : "light"}>Last 6 Months</Button>
                            <Button data-divisor="12" className="filter" onClick={handleToggle} id="last_year" variant={filter=== 'last_year' ? "primary" : "light"}>Last  Year</Button>
                            <Button className="filter" onClick={handleToggle} id="custom_range" variant={filter=== 'custom_range' ? "primary" : "light"}>Custom Date Range</Button>
                        </div>
                        {
                            (filter === 'custom_range') && 
                            <div  className="d-flex justify-content-start align-items-center p-3 gap">
                                <input className="p-2 rounded" required type="date" value={customDates.start} onChange={handleDateChange} id="start"/>
                                <span>&nbsp; to &nbsp; </span>
                                <input className="p-2 rounded" required type="date" value={customDates.end} onChange={handleDateChange} id="end" />
                                <Button variant="secondary" onClick={handleViewData}>View Data</Button>
                            </div>
                        }
                        
                        <div>
                            <h4 className="text-center">Chart</h4>
                            <Chart
                                chartType="ColumnChart"
                                data={chartData[1]}
                                options={chartData[0]}
                                graphID="ColumnChart"
                                width="100%"
                                height="400px"
                                formatters={[
                                    {
                                        type: "NumberFormat",
                                        column: 1,
                                        options: {
                                            prefix: CURRENCY_SYMBOL,
                                            fractionDigits: DECIMAL_DIGIT,
                                            negativeColor: "red"
                                        }
                                        }
                                    ]}
                            />
                        </div>
                    </Tab>
                    <Tab eventKey="Sales by Category" title="Sales by Category">
                    </Tab>
                    <Tab eventKey="Sales by Product" title="Sales by Product">
                    </Tab>
                </Tabs> 
                <div className="d-flex justify-content-center align-items-center p-3">
                    
                    {
                        headers.map((h, i) => <Card key={h} className="text-start my-2">
                                        <Card.Header className="p-2 fw-bold">{h}</Card.Header>
                                        <Card.Body className="p-3">{i===4 ? total[i] : priceFormatter()(total[i])}</Card.Body>
                                    </Card>)
                    }
                </div>
            </div>
             
        </>
     );
}
 
export default SalesReport;