<!DOCTYPE html>
<html lang="id" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Pesan baru dari {{ $contact->name }}</title>
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
              <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:700;color:#e6edf3;letter-spacing:-0.02em;">Shaturne</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="font-size:10px;font-family:'Courier New',Courier,monospace;color:#58d1e8;text-transform:uppercase;letter-spacing:0.18em;background:#58d1e81a;border:1px solid #58d1e840;border-radius:4px;padding:3px 7px;">PESAN BARU</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {{-- ── Main card ── --}}
          <tr>
            <td class="card" style="background:#161b22;border-radius:16px;border:1px solid #21262d;padding:36px;">

              {{-- Title --}}
              <p style="margin:0 0 28px 0;font-size:20px;font-weight:700;color:#e6edf3;line-height:1.3;">
                Kamu mendapat pesan baru
              </p>

              {{-- Sender block --}}
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
                     style="background:#0d1117;border-radius:10px;border:1px solid #21262d;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px 0;font-size:10px;font-family:'Courier New',Courier,monospace;color:#8b949e;text-transform:uppercase;letter-spacing:0.12em;">Pengirim</p>
                    <p style="margin:0 0 2px 0;font-size:16px;font-weight:600;color:#e6edf3;">{{ $contact->name }}</p>
                    <a href="mailto:{{ $contact->email }}" style="font-size:13px;color:#58d1e8;text-decoration:none;font-family:'Courier New',Courier,monospace;">{{ $contact->email }}</a>
                  </td>
                </tr>
              </table>

              {{-- Divider --}}
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #21262d;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              {{-- Message label --}}
              <p style="margin:0 0 12px 0;font-size:10px;font-family:'Courier New',Courier,monospace;color:#8b949e;text-transform:uppercase;letter-spacing:0.12em;">Isi pesan</p>

              {{-- Message body --}}
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
                     style="background:#0d1117;border-radius:10px;border-left:3px solid #58d1e8;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0;font-size:15px;line-height:1.75;color:#c9d1d9;white-space:pre-wrap;word-break:break-word;">{{ $contact->message }}</p>
                  </td>
                </tr>
              </table>

              {{-- CTA button --}}
              <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td style="border-radius:10px;background:#58d1e8;">
                    <a href="mailto:{{ $contact->email }}?subject=Re: Pesan dari Shaturne"
                       style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#0d1117;text-decoration:none;border-radius:10px;letter-spacing:0.01em;">
                      Balas Pesan
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          {{-- ── Footer ── --}}
          <tr>
            <td style="padding-top:24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-family:'Courier New',Courier,monospace;color:#30363d;">
                      {{ now()->timezone('Asia/Jakarta')->format('d M Y · H:i') }} WIB
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;font-family:'Courier New',Courier,monospace;color:#30363d;">
                      shaturne.dev
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
