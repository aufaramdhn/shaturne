<!DOCTYPE html>
<html lang="id" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Pesanmu sudah diterima — Shaturne</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #0d1117; }
    @media only screen and (max-width: 620px) {
      .outer { width: 100% !important; }
      .card  { border-radius: 12px !important; padding: 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
    <tr>
      <td align="center" style="padding:48px 16px 64px;">

        <table class="outer" width="580" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:580px;width:100%;">

          {{-- ── Header wordmark ── --}}
          <tr>
            <td style="padding-bottom:28px;">
              <span style="font-size:22px;font-weight:700;color:#e6edf3;letter-spacing:-0.02em;">Shaturne</span>
            </td>
          </tr>

          {{-- ── Main card ── --}}
          <tr>
            <td class="card" style="background:#161b22;border-radius:16px;border:1px solid #21262d;padding:36px;">

              {{-- Accent bar --}}
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:28px;">
                <tr>
                  <td style="background:linear-gradient(90deg,#58d1e8,#a78bfa);height:3px;border-radius:3px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              {{-- Greeting --}}
              <p style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:#e6edf3;line-height:1.3;">
                Hai, {{ $contact->name }}!
              </p>
              <p style="margin:0 0 24px 0;font-size:15px;line-height:1.75;color:#8b949e;">
                Pesanmu sudah saya terima. Saya akan membalasnya dalam <span style="color:#e6edf3;font-weight:500;">1&ndash;2 hari kerja</span> ke email ini.
              </p>

              {{-- Divider --}}
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #21262d;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              {{-- Message recap --}}
              <p style="margin:0 0 12px 0;font-size:10px;font-family:'Courier New',Courier,monospace;color:#8b949e;text-transform:uppercase;letter-spacing:0.12em;">Pesan yang kamu kirim</p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
                     style="background:#0d1117;border-radius:10px;border-left:3px solid #58d1e840;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0;font-size:14px;line-height:1.75;color:#8b949e;white-space:pre-wrap;word-break:break-word;font-style:italic;">{{ $contact->message }}</p>
                  </td>
                </tr>
              </table>

              {{-- Divider --}}
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:28px;">
                <tr><td style="border-top:1px solid #21262d;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              {{-- Sign off --}}
              <p style="margin:0 0 4px 0;font-size:15px;color:#8b949e;">Sampai segera,</p>
              <p style="margin:0;font-size:16px;font-weight:600;color:#e6edf3;">Aufa Ramadhan</p>
              <p style="margin:4px 0 0 0;font-size:12px;font-family:'Courier New',Courier,monospace;color:#58d1e8;">Fullstack Developer</p>

            </td>
          </tr>

          {{-- ── Footer ── --}}
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:11px;font-family:'Courier New',Courier,monospace;color:#30363d;line-height:1.6;">
                Email ini dikirim otomatis karena kamu menghubungi melalui shaturne.dev.<br>
                Jangan balas email ini langsung &mdash; gunakan tombol balas di email kamu.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
