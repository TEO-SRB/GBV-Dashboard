import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js";
import { plotMap } from "./utils/plot-map.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { downloadButton } from "./utils/download-button.js";
import { config } from "./config/config.js";
import { caveatLink } from "./utils/caveat-link.js";

window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Maps");
    insertHeader();
    insertNavButtons();

    document.getElementById("caveat-box").innerHTML = `
    <div class="alert alert-danger mb-0 h-100 d-flex align-items-center">
   
        <span>
             <b>For information:</b> The offence categories displayed here have been selected to provide an indication of violence against women and girls (VAWG). While this interim set has been developed to support this approach, it does not capture all forms of VAWG and may include offences that are not related to this issue.
            <a href="#" id="caveat-link">
                Click here for more information.
            </a>
        </span>
    </div>
    `;
    
    let data = await readData("PRCPD");
    // const da_data = await readData("DOMACLGD");

    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
        {
            day: "2-digit", 
            month: "long",
            year: "numeric"
        }
    );

    const allCrimesStat = "All crimes recorded by the police";
    const crimeRateStat = "Crime population rate (per 1000 population)";
    const years = Object.keys(data.data[allCrimesStat]);
    const latest_year = years[years.length - 1];

    const recentYears = years.slice(-5);
    let selectedYear = latest_year;

    let lgds = Object.keys(data.data[allCrimesStat][latest_year]);
    const oldKey = "Violence with injury (including homicide & death/serious injury by unlawful driving)";
    const newKey = "Violence with injury";
    for (let i = 0; i < lgds.length; i++) {
        for (let j = 0; j < recentYears.length; j++) {
            const obj = data.data[allCrimesStat][recentYears[j]][lgds[i]];
            obj[newKey] = obj[oldKey];
            delete obj[oldKey];

            const rateObj = data.data[crimeRateStat][recentYears[j]][lgds[i]];
            rateObj[newKey] = rateObj[oldKey];
            delete rateObj[oldKey];
        }
    }

    const crime_filter = document.getElementById("crime-filter");
    const metricRadios = document.querySelectorAll('input[name="map-metric"]');
    let crime_type = crime_filter.value;
    let mapMetric = document.querySelector('input[name="map-metric"]:checked')?.value || "rate";

    const yearSlider = document.getElementById("year-slider");
    const yearSliderValue = document.getElementById("year-slider-value");

    yearSlider.min = 0;
    yearSlider.max = recentYears.length - 1;
    yearSlider.step = 1;
    yearSlider.value = recentYears.length - 1;
    yearSliderValue.innerText = selectedYear;

    // first draw
    plotMap(data, selectedYear, crime_type, mapMetric, recentYears);

    // redraw when filter changes
    crime_filter.addEventListener("change", (e) => {
        crime_type = e.target.value;
        plotMap(data, selectedYear, crime_type, mapMetric, recentYears);
    });

    metricRadios.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            mapMetric = e.target.value;
            plotMap(data, selectedYear, crime_type, mapMetric, recentYears);
        });
    });

    yearSlider.addEventListener("input", (e) => {
        selectedYear = recentYears[Number(e.target.value)];
        yearSliderValue.innerText = selectedYear;
        plotMap(data, selectedYear, crime_type, mapMetric, recentYears);
    });

    downloadButton("map-card", "PRCPD", update_date, true)

    // Populate info boxes
    populateInfoBoxes(
        ["Definitions", "Source", "What does the data mean?"],
        [
            `<p>The tab presents data on offences as reported through the PSNI Recorded Crime System by Local Government District:</p>
            <ul>
                <li>Sexual offences</li>
                <li>Stalking and harassment</li>
                <li>Violence with injury</li>
                <li>Violence without injury</li>
            </ul>
            <p>Violence with injury includes homicide and death/serious injury by unlawful driving.</p>
            <p>The offence categories displayed here have been selected to provide an indication of violence against women and girls (VAWG). While this interim set has been developed to support this approach, it does not capture all forms of VAWG and may include offences that are not related to this issue. Further information on this approach can be found within the Technical Report.</p>
            <p>The location is based on where the offences take place.</p>
            <p>Crime population rates are calculated using the Northern Ireland mid-year population estimates published by NISRA.</p>
            <p>For additional considerations on Police Recorded Crime, please see the <a href"https://explore.nisra.gov.uk/gender-based-violence-dashboard/information" target="_blank">Information</a> page.</p>
            <p>Further information is available in the <a href="https://datavis.nisra.gov.uk/executiveofficeni/gender-based-violence-dashboard-technical-report.html#police-recorded-crime-data-interim-vawg-offences-and-domestic-abuse" target="_blank">Technical Report</a>.<p>`,

            `<p>Statistics on police recorded crime in Northern Ireland are collated and produced by statisticians seconded to the <strong>Police Service of Northern Ireland (PSNI)</strong> from the <strong>Northern Ireland Statistics and Research Agency (NISRA)</strong>.</p>
            <p>The data presented on this page are <strong>Accredited Official Statistics</strong> derived from police recorded crime data.</p>
            <p>While the PSNI does not fall within the jurisdiction of the Home Office, the practices and procedures of the Home Office’s notable offence list are followed and applied within Northern Ireland.</p>
            <p>The Crime recording process starts at the point at which an incident comes to the attention of police. This may be brought through a call for service from a member of the public, an incident being referred to the police by another agency or being identified by the police directly.</p>
            <p>This data is available on the <a href="${config.portal_url}" target="_blank">NISRA Data Portal</a> in the following tables:</p>
            <ul>
                <li><a href="${config.portal_url}table/PRCPD" target="_blank">Police recorded crime and crime population rate</a> - by Local Government District and crime type</li>
            </ul>
            <p>Downloaded data may contain additional information not displayed in the chart. For alternative breakdowns, please use the linked Data Portal table.</p>
            <p><strong>Data source</strong>: Data is sourced from the PSNI Police Recorded Crime Financial Year update, published each May. However, this publication is subsequently superseded by the corresponding Annual Trends publication, published each November. The Financial Year and Annual Trends publications use the same underlying data. Only in exceptional circumstances are revised figures included in the Annual Trends publication; where this occurs, this page will also be updated accordingly.</p>
            <p>Please note, this page is not updated using the PSNI monthly releases. For the most up-to-date data, please refer to the link below.</p>
            <p>Statistical publications can be found on the <a href="https://www.psni.police.uk/about-us/our-publications-and-reports/official-statistics/police-recorded-crime-statistics" target="_blank">PSNI - Police Recorded Crime Statistics website</a>.</p>
            <p>Further information is available in the <a href="https://datavis.nisra.gov.uk/executiveofficeni/gender-based-violence-dashboard-technical-report.html#police-recorded-crime-data-interim-vawg-offences-and-domestic-abuse" target="_blank">Technical Report</a>.<p>
            <p><strong>Updates:</strong> Data updated annually in May; only in cases of revised figures will data be updated in November.</p>`,

            `<p>This tab shows where offences occurred for police-recorded crime offence categories selected to provide an indication of violence against women and girls. The offence categories include sexual offences, stalking and harassment, and violence with or without injury.</p>
            <ul>
                <li><strong>What it tells us:</strong> It highlights the geographic location of the offence itself, not where the victim lives. This distinction is important because offences can happen away from home—for example, in public spaces or workplaces.</li>
                <li><strong>Why it matters:</strong> Understanding where offences occur helps identify hotspots and inform targeted prevention efforts, policing strategies, and community safety initiatives.</li>
                <li><strong>How to use it:</strong> Use these maps to guide local interventions, resource deployment, and awareness campaigns in areas with higher recorded incidents.</li>
                <li><strong>Strengths/Limitations:</strong> Location data reflects where the offence occurred, which may differ from where the victim resides. It can, but does not always, indicate risk for individuals living in that area.</li>
                <li>Changes in legislation and crime recording practices should be considered when interpreting trends in stalking and harassment. The Protection from Stalking Act (NI) 2022 introduced a new specific stalking offence and an offence of threatening or abusive behaviour from April 2022, increasing identification and reporting. Between April 2018 – April 2023, Home Office rules required recording both a conduct offence and any additional offence in the same incident, leading to some double counting. From May 2023, this was reversed so that the conduct/behaviour offence is recorded only if it is the most serious offence, contributing to falls seen in 2023/24. These factors should be taken into account when comparing trends over time.</li></ul>
                <p>Please refer to the <a href="https://datavis.nisra.gov.uk/executiveofficeni/gender-based-violence-dashboard-technical-report.html#strengths-police-recorded-crime-data---interim-vawg-offences-and-domestic-abuse" target="_blank">Technical Report</a> for further information on the strengths and limitations of the data.</p>`            
        ]
    );

        caveatLink();
        insertFooter();

});