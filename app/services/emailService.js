const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

const sendEmail = async (recipient, clientName, newStatus, orderId) => {
    const formattedStatus = {
        'emAnalise': 'Em Análise',
        'confirmado': 'Confirmado',
        'preparando': 'Preparando',
        'finalizado': 'Finalizado',
        'recusado': 'Recusado'
    };

    const statusText = formattedStatus[newStatus] || newStatus;

    const mailOptions = {
        from: `"Sinhá Bolos e Lanches" <${process.env.EMAIL_USER}>`,
        to: recipient, 
        subject: `Atualização do Pedido #${orderId}: ${statusText}`, 
        html: `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
                    
                    body, p, h1, h2, a, div {
                        font-family: 'Poppins', Arial, sans-serif !important;
                    }
                </style>
            </head>
            <body style="margin: 0; padding: 0;">
                <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #fbd6d3; padding: 20px;">
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #9a1c1f; margin: 0; font-family: 'Brush Script MT', cursive, sans-serif; font-size: 36px;">Sinhá Bolos e Lanches</h1>
                    </div>

                    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <h2 style="color: #9a1c1f; font-family: 'Poppins', Arial, sans-serif;">Olá, ${clientName}!</h2>
                        
                        <p style="color: #333; font-family: 'Poppins', Arial, sans-serif;">O status do seu pedido <strong>#${orderId}</strong> foi atualizado.</p>
                        
                        <p style="color: #333; font-family: 'Poppins', Arial, sans-serif;">Novo status: <strong style="color: #9a1c1f; font-size: 18px;">${statusText}</strong></p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://projeto-extensao-2.vercel.app/orders/${orderId}" 
                            style="background-color: #9a1c1f; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; font-family: 'Poppins', Arial, sans-serif;">
                            Ver Detalhes do Pedido
                            </a>
                        </div>

                        <hr style="border: 0; border-top: 2px solid #fbd6d3; margin: 20px 0;">
                        
                        <p style="color: #555; font-size: 14px; font-family: 'Poppins', Arial, sans-serif;">Ou acesse diretamente pelo link: <br>
                            <a href="https://projeto-extensao-2.vercel.app/orders/${orderId}" style="color: #9a1c1f; word-break: break-all;">https://projeto-extensao-2.vercel.app/orders/${orderId}</a>
                        </p>

                        <p style="color: #9a1c1f; font-weight: bold; margin-top: 30px; font-family: 'Poppins', Arial, sans-serif;">Atenciosamente,<br>Equipe Sinhá Bolos e Lanches</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado: ' + info.response);
        return true;
    } catch (error) {
        console.error("Erro ao enviar email:", error);
        return false;
    }
};

module.exports = sendEmail;