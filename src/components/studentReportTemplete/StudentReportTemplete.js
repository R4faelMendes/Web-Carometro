export default function studentReportTemplate(student, incidents) {

  const incidentsHtml = incidents.map((incident, index) => `
    <div class="incident-card">
        <div class="incident-header">
            <span class="incident-number">
                Ocorrência #${index + 1}
            </span>

            <span class="incident-date">
                ${incident.incident_type}
            </span>

            <span class="incident-date">
                ${incident.incident_date}
            </span>
        </div>

        <div class="incident-content">
            ${incident.incident_description}
        </div>
    </div>
  `).join("");

  return `
    <html>
      <head>
        <meta charset="UTF-8" />

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 25px;
            background-color: #f5f5f5;
            color: #333;
          }

          .container {
            background-color: white;
            border-radius: 18px;
            padding: 25px;
            border: 1px solid #ddd;
          }

          .header {
            display: flex;
            align-items: center;
            border-bottom: 2px solid #2957A4;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }

          .avatar {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea, #764ba2);

            display: flex;
            align-items: center;
            justify-content: center;

            color: white;
            font-size: 38px;
            font-weight: bold;

            margin-right: 20px;
          }

          .student-info h1 {
            margin: 0;
            color: #2957A4;
            font-size: 28px;
          }

          .student-info p {
            margin: 5px 0;
            font-size: 16px;
          }

          .section-title {
            margin-top: 20px;
            margin-bottom: 20px;
            font-size: 22px;
            color: #2957A4;
            border-left: 5px solid #2957A4;
            padding-left: 10px;
          }

          .incident-card {
            border: 1px solid #ddd;
            border-radius: 14px;
            padding: 15px;
            margin-bottom: 15px;
            background-color: #fafafa;
          }

          .incident-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }

          .incident-number {
            font-weight: bold;
            color: #2957A4;
          }

          .incident-date {
            color: #777;
            font-size: 14px;
          }

          .incident-content {
            font-size: 15px;
            line-height: 1.5;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            color: #888;
            font-size: 12px;
          }
        </style>
      </head>

      <body>
        <div class="container">

          <div class="header">
            <div class="avatar">
              ${student.student_picture || student.student_name?.[0]?.toUpperCase() || "?"}
            </div>

            <div class="student-info">
              <h1>${student.student_name}</h1>

              <p>
                <strong>Turma:</strong>
                ${student.class_id}
              </p>

              <p>
                <strong>Total de ocorrências:</strong>
                ${incidents.length}
              </p>
            </div>
          </div>

          <div class="section-title">
            Histórico de Ocorrências
          </div>

          ${incidentsHtml}

          <div class="footer">
            Documento gerado automaticamente pelo sistema escolar
          </div>

        </div>
      </body>
    </html>
  `;
}