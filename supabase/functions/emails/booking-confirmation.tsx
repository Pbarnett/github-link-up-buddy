/**
 * React Email Component for Booking Confirmations
 * Following Resend best practices for email templates
 */

import * as React from 'react';

export interface BookingConfirmationProps {
  passengerName: string;
  bookingReference: string;
  flightDetails: {
    airline: string;
    flightNumber: string;
    departure: {
      airport: string;
      city: string;
      date: string;
      time: string;
      terminal?: string;
      gate?: string;
    };
    arrival: {
      airport: string;
      city: string;
      date: string;
      time: string;
      terminal?: string;
      gate?: string;
    };
    duration: string;
    aircraft?: string;
    seat?: string;
  };
  price: {
    total: string;
    currency: string;
    breakdown?: {
      baseFare: string;
      taxes: string;
      fees: string;
    };
  };
  passengerInfo?: {
    email: string;
    phone?: string;
  };
  additionalInfo?: {
    checkinUrl?: string;
    supportUrl?: string;
    baggageInfo?: string;
  };
}

export const BookingConfirmationEmail: React.FC<BookingConfirmationProps> = ({
  passengerName,
  bookingReference,
  flightDetails,
  price,
  passengerInfo,
  additionalInfo
}) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Flight Booking Confirmed - {bookingReference}</title>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f6f9fc;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .email-wrapper {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .header .emoji {
            font-size: 40px;
            display: block;
            margin-bottom: 10px;
          }
          .content {
            padding: 30px;
          }
          .booking-reference {
            background-color: #f8fafc;
            border: 2px dashed #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
          }
          .booking-reference-code {
            font-size: 24px;
            font-weight: 700;
            color: #2d3748;
            letter-spacing: 2px;
            font-family: 'Courier New', monospace;
          }
          .flight-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin: 20px 0;
            overflow: hidden;
          }
          .flight-header {
            background-color: #edf2f7;
            padding: 15px 20px;
            font-weight: 600;
            color: #2d3748;
          }
          .flight-details {
            padding: 20px;
          }
          .route {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 20px 0;
          }
          .airport {
            text-align: center;
            flex: 1;
          }
          .airport-code {
            font-size: 20px;
            font-weight: 700;
            color: #2d3748;
          }
          .airport-name {
            font-size: 14px;
            color: #718096;
            margin: 5px 0;
          }
          .flight-arrow {
            margin: 0 20px;
            color: #667eea;
            font-size: 24px;
          }
          .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
          }
          .detail-item {
            padding: 12px;
            background-color: #f7fafc;
            border-radius: 6px;
          }
          .detail-label {
            font-size: 12px;
            color: #718096;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .detail-value {
            font-size: 14px;
            color: #2d3748;
            font-weight: 500;
          }
          .price-summary {
            background-color: #f0fff4;
            border: 1px solid #9ae6b4;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .total-price {
            font-size: 28px;
            font-weight: 700;
            color: #22543d;
            text-align: center;
          }
          .action-buttons {
            text-align: center;
            margin: 30px 0;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 0 10px 10px 0;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            text-align: center;
            transition: all 0.2s;
          }
          .btn-primary {
            background-color: #667eea;
            color: white;
          }
          .btn-secondary {
            background-color: #edf2f7;
            color: #4a5568;
            border: 1px solid #e2e8f0;
          }
          .important-info {
            background-color: #fffaf0;
            border-left: 4px solid #f6ad55;
            padding: 16px;
            margin: 20px 0;
          }
          .footer {
            background-color: #f7fafc;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #718096;
          }
          @media only screen and (max-width: 600px) {
            .container { padding: 10px; }
            .content { padding: 20px; }
            .detail-grid { grid-template-columns: 1fr; }
            .route { flex-direction: column; }
            .flight-arrow { margin: 10px 0; transform: rotate(90deg); }
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="email-wrapper">
            {/* Header */}
            <div className="header">
              <span className="emoji">✈️</span>
              <h1>Booking Confirmed!</h1>
              <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
                Your flight is booked and ready to go
              </p>
            </div>

            {/* Content */}
            <div className="content">
              <p>Dear {passengerName},</p>
              <p>
                Great news! Your flight booking has been confirmed. We're excited to be part of your journey.
              </p>

              {/* Booking Reference */}
              <div className="booking-reference">
                <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>
                  Booking Reference
                </div>
                <div className="booking-reference-code">{bookingReference}</div>
                <div style={{ fontSize: '12px', color: '#a0aec0', marginTop: '8px' }}>
                  Keep this reference handy for check-in and support
                </div>
              </div>

              {/* Flight Details */}
              <div className="flight-card">
                <div className="flight-header">
                  Flight Details - {flightDetails.airline} {flightDetails.flightNumber}
                </div>
                <div className="flight-details">
                  {/* Route */}
                  <div className="route">
                    <div className="airport">
                      <div className="airport-code">{flightDetails.departure.airport}</div>
                      <div className="airport-name">{flightDetails.departure.city}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', margin: '8px 0' }}>
                        {flightDetails.departure.date}
                      </div>
                      <div style={{ fontSize: '16px', color: '#667eea', fontWeight: '600' }}>
                        {flightDetails.departure.time}
                      </div>
                      {flightDetails.departure.terminal && (
                        <div style={{ fontSize: '12px', color: '#718096' }}>
                          Terminal {flightDetails.departure.terminal}
                        </div>
                      )}
                    </div>
                    <div className="flight-arrow">✈️</div>
                    <div className="airport">
                      <div className="airport-code">{flightDetails.arrival.airport}</div>
                      <div className="airport-name">{flightDetails.arrival.city}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', margin: '8px 0' }}>
                        {flightDetails.arrival.date}
                      </div>
                      <div style={{ fontSize: '16px', color: '#667eea', fontWeight: '600' }}>
                        {flightDetails.arrival.time}
                      </div>
                      {flightDetails.arrival.terminal && (
                        <div style={{ fontSize: '12px', color: '#718096' }}>
                          Terminal {flightDetails.arrival.terminal}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Flight Info Grid */}
                  <div className="detail-grid">
                    <div className="detail-item">
                      <div className="detail-label">Duration</div>
                      <div className="detail-value">{flightDetails.duration}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Aircraft</div>
                      <div className="detail-value">{flightDetails.aircraft || 'TBA'}</div>
                    </div>
                    {flightDetails.seat && (
                      <div className="detail-item">
                        <div className="detail-label">Seat</div>
                        <div className="detail-value">{flightDetails.seat}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="price-summary">
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '14px', color: '#22543d', fontWeight: '600' }}>
                    Total Paid
                  </div>
                  <div className="total-price">
                    {price.currency} {price.total}
                  </div>
                </div>
                {price.breakdown && (
                  <div style={{ fontSize: '12px', color: '#2d3748', textAlign: 'center' }}>
                    Base: {price.breakdown.baseFare} • Taxes: {price.breakdown.taxes} • Fees: {price.breakdown.fees}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                {additionalInfo?.checkinUrl && (
                  <a href={additionalInfo.checkinUrl} className="btn btn-primary">
                    Check-in Online
                  </a>
                )}
                {additionalInfo?.supportUrl && (
                  <a href={additionalInfo.supportUrl} className="btn btn-secondary">
                    Need Help?
                  </a>
                )}
              </div>

              {/* Important Information */}
              <div className="important-info">
                <strong>📋 Important Reminders:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li>Check-in online 24-48 hours before departure</li>
                  <li>Arrive at the airport at least 2 hours early for domestic flights</li>
                  <li>Ensure your ID/passport is valid and matches your booking</li>
                  {additionalInfo?.baggageInfo && (
                    <li>{additionalInfo.baggageInfo}</li>
                  )}
                </ul>
              </div>

              <p>
                We'll send you a reminder 24 hours before your departure. 
                Safe travels and thank you for choosing Parker Flight!
              </p>
            </div>

            {/* Footer */}
            <div className="footer">
              <p>This is an automated message from Parker Flight.</p>
              <p>
                For support, contact us at support@parkerflight.com or visit our help center.
              </p>
              <p style={{ marginTop: '15px' }}>
                Parker Flight • Making travel simple and reliable
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default BookingConfirmationEmail;
