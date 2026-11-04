import { insertHeader, insertFooter, insertNavButtons, insertHead } from "./utils/page-layout.js"
import { readData } from "./utils/read-data.js"
import { genderDisplay } from "./utils/gender-display.js";
import { createLineChart, createBarChart, createBarChartData } from "./utils/charts.js";
import { years, latest_year, updateYearSpans } from "./utils/update-years.js";
import { insertValue } from "./utils/insert-value.js";
import { populateInfoBoxes } from "./utils/info-boxes.js";
import { downloadButton } from "./utils/download-button.js";
import { config } from "./config/config.js"
import { insertExpandButtons } from "./utils/expand-buttons.js";
import { caveatLink } from "./utils/caveat-link.js";


window.addEventListener("DOMContentLoaded", async () => {

    await insertHead("Violence against girls and boys");
    insertHeader();
    genderDisplay();
    insertNavButtons();
    insertExpandButtons();

    document.getElementById("caveat-box").innerHTML = `
    <div class="alert alert-warning mt-2 mb-0 h-100 d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <span>
            Caveat text goes here.
            <a href="#" id="caveat-link">
                Click here for more information.
            </a>
        </span>
    </div>
    `;

    let data = await readData("PRCHOM");
    const update_date = new Date(data.updated).toLocaleDateString("en-GB",
            {
                day: "2-digit", 
                month: "long",
                year: "numeric"
            });
    
    // Update values

    const stat = "All homicides";

    updateYearSpans(data, stat);

    let female_victims = 0;
    let male_victims = 0;  

    for (let i = years.length - 5; i < years.length; i ++) {
        female_victims += data.data[stat][years[i]]["All ages"]["Female"];
        male_victims += data.data[stat][years[i]]["All ages"]["Male"];
    }

    insertValue("victims-female", female_victims);
    insertValue("victims-male",  male_victims);
    insertValue("year-range", years[years.length - 5] + " to " + latest_year);

    const victims_girls = data.data[stat][latest_year]["Under 18 years"]["Female"];
    const victims_boys = data.data[stat][latest_year]["Under 18 years"]["Male"];

    const victims_girls_text = victims_girls == 1 ? "1 female" : `${victims_girls} females`;
    const victims_boys_text = victims_boys == 1 ? "1 male" : `${victims_boys} males`;

    insertValue("victims-girls", victims_girls_text);
    insertValue("victims-boys", victims_boys_text);

    const victims_women = data.data[stat][latest_year]["18+ years"]["Female"];
    const victims_men = data.data[stat][latest_year]["18+ years"]["Male"];
    const victims_women_text = victims_women == 1 ? "1 female" : `${victims_women} females`;
    const victims_men_text = victims_men == 1 ? "1 male" : `${victims_men} males`;

    insertValue("victims-women", victims_women_text);
    insertValue("victims-men", victims_men_text);

    // Line chart - victims under 18

    createLineChart({
        data,
        stat,
        years,
        line_1: ["Under 18 years", "Female"],
        label_1: "Female",
        line_2: ["Under 18 years", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "under-18-line"
    });

    createLineChart({
        data,
        stat,
        years,
        line_1: ["Under 18 years", "Female"],
        label_1: "Female",
        line_2: ["Under 18 years", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "under-18-line-expanded"
    });

    downloadButton("under-18-line-capture", "PRCHOM", update_date);

    // Line chart - victims 18+

    createLineChart({
        data,
        stat,
        years,
        line_1: ["18+ years", "Female"],
        label_1: "Female",
        line_2: ["18+ years", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "18-plus-line"
    });

    createLineChart({
        data,
        stat,
        years,
        line_1: ["18+ years", "Female"],
        label_1: "Female",
        line_2: ["18+ years", "Male"],
        label_2: "Male",
        unit: "Victims",
        canvas_id: "18-plus-line-expanded"
    });

    downloadButton("18-plus-line-capture", "PRCHOM", update_date);

    // Populate info boxes
    
        populateInfoBoxes(
            ["Definitions", "Source", "What does the data mean?"],
            [
                `<p>This tab presents data on the number of homicide victims in Northern Ireland, including their age and gender. Homicide recorded by the police includes murder, manslaughter, corporate manslaughter and infanticide.</p>
                   <p> The year in which a homicide is recorded for crime recording purposes is based on the date it is established as homicide; the date of death may have occurred in a previous year.</p>
                    <p> These figures are based on crimes reported to and recorded by the police, in line with the National Crime Recording Standard (NCRS) and Home Office Counting Rules (HOCR). Data are presented on a victim basis, with each victim counted once.</p>
                    <p> Homicide classifications may be revised as investigations progress or cases are concluded, and figures for recent years are therefore subject to revision. Revisions were made to the homicide time series for the period 2014/15 to 2023/24 following a review of this data in 2024/25.
                    <p>Changes in reporting behaviour, recording practices and data revisions should be considered when interpreting trends over time.
                </p>`,

                `<p>Statistics on police recorded crime in Northern Ireland are collated and produced by statisticians seconded to the <strong>Police Service of Northern Ireland (PSNI)</strong> from the <strong>Northern Ireland Statistics and Research Agency (NISRA)</strong>.</p>
                 <p>The data presented on this page are <strong>Accredited Official Statistics</strong> derived from police recorded crime data.</p>   
                <p>While the PSNI does not fall within the jurisdiction of the Home Office, the practices and procedures of the Home Office's notable offence list are followed and applied within Northern Ireland.
                    The crime recording process starts at the point at which an incident comes to the attention of police. This may be brought through a call for service from a member of the public, an incident being referred to the police by another agency or being identified by the police directly.
                     <p>This data is available on the <a href="${config.portal_url}" target="_blank">NISRA Data Portal</a> in the following tables:</p>
        <ul>
            <li><a href="${config.portal_url}table/PRCHOM" target="_blank">Victims of homicide recorded</a> - by victim age and gender</li>
        </ul>
<p><strong>Data source</strong>: Data is sourced from the PSNI Police Recorded Crime Financial Year update, published each May. However, this publication is subsequently superseded by the corresponding Annual Trends publication, published each November. The Financial Year and Annual Trends publications use the same underlying data. Only in exceptional circumstances are revised figures included in the Annual Trends publication; where this occurs, this page will also be updated accordingly.</p> 
<p>Please note, this page is not updated using the PSNI Homicide bulletin or monthly police recorded crime releases. For the most up-to-date homicide data, please refer to the link below.
</p>
<p>Statistical publications can be found on the <a href="https://www.psni.police.uk/about-us/our-publications-and-reports/official-statistics/police-recorded-crime-statistics" target="_blank">PSNI - Police Recorded Crime Statistics website</a>.</p>
<p><strong>Updates:</strong> Data is updated annually in May; only in cases of revised figures will data be updated in November.</p>
                </p>`,

                `<p>This tab presents data on the number of homicide victims in Northern Ireland, including their age and gender. Homicide recorded by the police includes murder, manslaughter, corporate manslaughter and infanticide.<p>
                <ul>
    <li><strong>What it tells us:</strong> Homicide is rare but represents the most severe outcome of gender-based violence.</li>
    <li><strong>Why it matters:</strong> These figures underline the importance of early intervention and risk assessment to prevent escalation.</li>
    <li><strong>How to use it:</strong> Incorporate insights into high-risk case management and multi-agency safeguarding approaches.</li>
    <li><strong>Strengths/Limitations:</strong> Please refer to the technical report for further information on the strengths and limitations of the data.<br>
    </li>
</ul>`
            
            ]
        );

        caveatLink();
        insertFooter();



    

                


})