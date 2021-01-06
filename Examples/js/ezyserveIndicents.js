(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "incidentNumber",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "incidentType",
            alias: "IncidentType",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "incidentTitle",
            alias: "Title",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "incidentNature",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "incidents",
            alias: "Incidents QA",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://192.168.5.131:5006/pr%24158f13ac-719b-4dd0-a25c-a61a8a06a776/_design/testQuery/_view/incidents", function(resp) {
            var indcidents = resp.rows,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = indcidents.length; i < len; i++) {
                var eachIncident = indcidents[i].value.attributes;
                tableData.push({
                    "incidentNumber": eachIncident.incidentId,
                    "incidentType": eachIncident.incidentType,
                    "incidentTitle": eachIncident.title,
                    "incidentNature": eachIncident.incidentNature
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "QA Incidents"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
