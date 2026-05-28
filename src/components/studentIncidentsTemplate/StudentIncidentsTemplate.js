export default function generateStudentIncidentsPdf(student, className, cpf, incidents) {
  const html = `
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: Arial;
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
        .main-header {
          border-bottom: 2px solid #2957A4;
          padding-bottom: 20px;
          margin-bottom: 25px;
        }
        .main-header h1 {
          margin: 0;
          color: #2957A4;
          font-size: 32px;
        }
        .main-header p {
          margin-top: 10px;
          color: #666;
          font-size: 16px;
        }
        .student-section {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          padding: 20px;
          background-color: #fafafa;
          border-radius: 14px;
          border: 1px solid #ddd;
        }
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
          font-weight: bold;
          margin-right: 20px;
        }
        .student-info h2 {
          margin: 0;
          color: #2957A4;
          font-size: 26px;
        }
        .student-info p {
          margin-top: 8px;
          font-size: 16px;
          color: #555;
        }
        .incident-card {
          border: 1px solid #ddd;
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 18px;
          background-color: #fafafa;
        }
        .incident-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
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
          background-color: white;
          padding: 14px;
          border-radius: 10px;
          border-left: 4px solid #2957A4;
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
        <div class="main-header">
          <h1>Relatório de Ocorrências</h1>
          <p>
            Total de ocorrências registradas para este aluno:
            <strong>${incidents.length}</strong>
          </p>
        </div>

        <div class="student-section">
          <div class="avatar">
            ${student?.student_name?.[0]?.toUpperCase() || "?"}
          </div>
          <div class="student-info">
            <h2>${student?.student_name || "Aluno"}</h2>
            <p>
              <strong>Turma:</strong> ${className} &nbsp;|&nbsp; 
              <strong>CPF:</strong> ${cpf}
            </p>
          </div>
        </div>

        ${incidents.length === 0 ? `
          <div class="incident-card">
            <div class="incident-content" style="text-align: center; border-left: none;">
              Nenhuma ocorrência registrada.
            </div>
          </div>
        ` : incidents.map((incident, index) => `
          <div class="incident-card">
            <div class="incident-header">
              <span class="incident-number">
                Ocorrência #${index + 1}
              </span>
              <span class="incident-date">
                ${incident.incident_type}
              </span>
              <span class="incident-date">
                ${incident.incident_date ? incident.incident_date.split("T")[0] : ""}
              </span>
            </div>
            <div class="incident-content">
              ${incident.incident_description || "Sem descrição."}
            </div>
          </div>
        `).join("")}

        <div class="footer">
          Documento gerado automaticamente pelo sistema escolar - ${new Date().toLocaleDateString("pt-BR")}
        </div>
      </div>
    </body>
  </html>
  `;

  return html;
}
