import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js";
import { createLineChart } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { downloadButton } from "./utils/download-button.js";
import { config } from "./config/config.js"
import { insertExpandButtons } from "./utils/expand-buttons.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Case processing times")
    insertHeader();
    insertNavButtons();
    insertExpandButtons();

    let data = await readData("CPTALCRM");
    let dom_data = await readData("CPTDAC");

    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
        {
            day: "2-digit", 
            month: "long",
            year: "numeric"
        });

    const dom_update_date = new Date(dom_data.updated).toLocaleDateString("en-GB",
        {
            day: "2-digit", 
            month: "long",
            year: "numeric"
        });

        // Update values
    const stat = "Median days taken to process";
    const dom_stat = "Median days taken to process";
    const dom_years = Object.keys(dom_data.data[dom_stat]);

    updateYearSpans(data, stat);

    insertValue("sexual-case-processing", data.data[stat][latest_year]["Offence category - Sexual"]);
    insertValue("all-case-processing", data.data[stat][latest_year]["All criminal cases"]);

    const dom_latest_year = dom_years[dom_years.length - 1];
    insertValue("domestic-days", dom_data.data[dom_stat][dom_latest_year]["All domestic abuse cases"]);
    Array.from(document.getElementsByClassName("domestic-latest-year")).forEach(el => el.innerText = dom_latest_year);

    // Create line chart
    createLineChart({
        data,
        stat,
        years,
        line_1: ["All criminal cases"],
        line_2: ["Offence category - Sexual"],
        label_1: "All criminal cases",
        label_2: "Sexual offence cases",
        unit: "Days",
        canvas_id: "case-processing-sexual-line",
    });

     createLineChart({
        data,
        stat,
        years,
        line_1: ["All criminal cases"],
        line_2: ["Offence category - Sexual"],
        label_1: "All criminal cases",
        label_2: "Sexual offence cases",
        unit: "Days",
        canvas_id: "case-processing-sexual-line-expanded",
    });

    downloadButton("case-processing-sexual-line-capture", "CPTALCRM", update_date)

    

    createLineChart({
        data: dom_data,
        stat: dom_stat,
        years: dom_years,
        line_2: ["All domestic abuse cases"],
        line_1: ["All criminal cases"],
        label_2: "Domestic abuse related cases",
        label_1: "All criminal cases",
        unit: "Days",
        canvas_id: "case-processing-domestic-line",
    });

    createLineChart({
        data: dom_data,
        stat: dom_stat,
        years: dom_years,
        line_2: ["All domestic abuse cases"],
        line_1: ["All criminal cases"],
        label_2: "Domestic abuse related cases",
        label_1: "All criminal cases",
        unit: "Days",
        canvas_id: "case-processing-domestic-line-expanded",
    });

    downloadButton("case-processing-domestic-line-capture", "CPTDAC", dom_update_date)

    // Populate info boxes
       
    
        populateInfoBoxes(
            ["Definitions", "Source", "What does the data mean?"],
            [
            `<p>Case processing time statistics measure the time taken for criminal cases to progress through the criminal justice system, from the reporting or detection of an offence by police until the conclusion of court proceedings. Processing time is measured as the number of calendar days between the offence reported date and the case dealt with date.</p>
            <p>This tab presents data on processing times for all criminal cases, alongside sexual offence and domestic abuse related cases. All criminal cases provide a wider comparator, while sexual offence and domestic abuse related cases are used as interim measures to provide insight into the timeliness of cases relevant to violence against women and girls.</p>
            <p>For case processing times data, sexual offence cases are based on cases where the principal offence (main offence) at disposal was a sexual offence. Where an offender is prosecuted or convicted of several offences on the same occasion, only one offence, the principal offence, is counted. Statistical coverage is restricted to those criminal prosecutions which were brought on behalf of the Police Service for Northern Ireland, the National Crime Agency, the Airport Constabulary or Harbour Police.</p>
            <p>For domestic abuse related cases, the average case processing time relates to cases where at least one offence in the case was prosecuted under the Domestic Abuse and Civil Proceedings Act (Northern Ireland) 2021.</p>
            <p>Further information is available in the <a href="https://datavis.nisra.gov.uk/executiveofficeni/gender-based-violence-dashboard-technical-report.html#criminal-case-data-case-processing-times" target="_blank">Technical Report</a>.<p>`,

`<p>The most recent average Case Processing Times for Criminal Cases dealt with in the Crown Court and in magistrates’ courts in Northern Ireland is for cases completed in 2025/26 and refers to the time from which the offence was reported to, or detected by, the police.</p>
<p>The data presented on this page are <strong>Official Statistics</strong> derived from administrative records held within the Causeway Data Sharing Mechanism, a shared information system used by criminal justice organisations in Northern Ireland. The statistics are published by the <b>Department of Justice (DoJ)</b>.</p>
<p>This data is based on all court cases – Crown Court, adult magistrates’ court, and youth magistrates’ court.</p>
<p>Figures presented on this page show the median time taken for criminal cases dealt with at the Crown Court and magistrates’ courts in Northern Ireland. Processing time is measured as the number of calendar days from the date an offence was reported to the date the case was completed at court, for cases dealt with in the year specified. The median is the number of days within which 50% of cases have been completed.</p>
  <p>This data is available on the <a href="${config.portal_url}" target="_blank">NISRA Data Portal</a> in the following tables:</p>
    <ul>
        <li><a href="${config.portal_url}table/CPTALCRM" target="_blank">Processing times for sexual offence cases</a> - by case type</li>
        <li><a href="${config.portal_url}table/CPTDAC" target="_blank">Processing times for domestic abuse related cases</a> - by case type</li>      
    </ul>
<p>Statistical publications can be found on the Department of Justice website:
    <ul>
        <li><a href="https://www.justice-ni.gov.uk/articles/case-processing-times" target="_blank">Criminal cases</a></li>
        <li><a href="https://www.justice-ni.gov.uk/articles/domestic-abuse-prosecutions-convictions-and-case-processing-time-statistics" target="_blank">Domestic abuse cases</a></li>
    </ul>
    <p>Downloaded data may contain additional information not displayed in the chart. For alternative breakdowns, please use the linked Data Portal table.</p>
<p>Further information is available in the <a href="https://datavis.nisra.gov.uk/executiveofficeni/gender-based-violence-dashboard-technical-report.html#criminal-case-data-case-processing-times" target="_blank">Technical Report</a>.<p>
    <p><strong>Updates:</strong> Data updated annually; updates include revisions to data reported in earlier financial years.</p>`,

`<p>This tab shows how long it takes for cases related to violence and abuse to progress through the court system, from initial charge to final outcome.</p>
<ul>
    <li><strong>What it tells us:</strong> It highlights average (median) processing times for different types of cases, giving insight into how quickly justice is delivered.</li>
    <li><strong>Why it matters:</strong> Delays in case processing can impact victims' confidence in the justice system and prolong trauma. Understanding these timelines helps identify where improvements are needed.</li>
    <li><strong>How to use it:</strong> Use this data to inform discussions on court efficiency, resource allocation, and victim support during lengthy proceedings. It can also guide policy aimed at reducing delays.</li>
    <li><strong>Strengths/Limitations:</strong> Figures reflect completed cases only and may be influenced by, for example, case complexity, availability of court resources, and procedural requirements. They do not capture cases that result in informal resolutions or cases withdrawn before trial.</li>
</ul>
<p>Please refer to the <a href="https://datavis.nisra.gov.uk/executiveofficeni/gender-based-violence-dashboard-technical-report.html#Strengths:_Criminal_Case_Data_-_Case_Processing_Times" target="_blank">Technical Report</a> for further information on the strengths and limitations of the data.</p>`


            
            ]
        );

        insertFooter();

})