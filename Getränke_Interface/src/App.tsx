import React, { useState } from 'react';
import { Member } from './types';
import { mockMembers } from './data/mockData';
import wappen from 'figma:asset/bae83dea223a67bc643e7727f2698c698283b6df.png';

export default function App() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [orders, setOrders] = useState<{member: string, amount: number, time: string}[]>([]);
  const [selectedDrinks, setSelectedDrinks] = useState<{[key: number]: number}>({
    1.00: 0,
    0.65: 0,
    0.45: 0
  });

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setSelectedDrinks({ 1.00: 0, 0.65: 0, 0.45: 0 });
  };

  const handlePriceClick = (amount: number) => {
    setSelectedDrinks(prev => ({
      ...prev,
      [amount]: prev[amount] + 1
    }));
  };

  const handleConfirmOrder = () => {
    if (!selectedMember) return;
    
    const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const newOrders = [];
    
    // Create order for each selected drink
    Object.entries(selectedDrinks).forEach(([price, count]) => {
      for (let i = 0; i < count; i++) {
        newOrders.push({
          member: selectedMember.name,
          amount: parseFloat(price),
          time: time
        });
      }
    });
    
    if (newOrders.length > 0) {
      setOrders(prev => [...newOrders, ...prev]);
      
      const totalAmount = newOrders.reduce((sum, order) => sum + order.amount, 0);
      const drinksSummary = Object.entries(selectedDrinks)
        .filter(([_, count]) => count > 0)
        .map(([price, count]) => `${count}x ${parseFloat(price).toFixed(2)}€`)
        .join(', ');
      
      alert(`${drinksSummary} für ${selectedMember.name} gebucht (Gesamt: ${totalAmount.toFixed(2)}€)`);
      
      setSelectedMember(null);
      setSelectedDrinks({ 1.00: 0, 0.65: 0, 0.45: 0 });
    }
  };

  const getTotalSelected = () => {
    return Object.values(selectedDrinks).reduce((sum, count) => sum + count, 0);
  };

  const totalToday = orders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '20px', 
      backgroundColor: '#f8f8f8',
      minHeight: '100vh'
    }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        borderBottom: '4px solid #dc2626',
        paddingBottom: '20px',
        backgroundColor: '#ffffff',
        padding: '20px',
        border: '3px solid #dc2626'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
          <img src={wappen} alt="Wappen" style={{ height: '60px', width: 'auto' }} />
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px',
            color: '#dc2626',
            fontWeight: 'bold'
          }}>
            AV GETRÄNKE TAFEL
          </h1>
          <img src={wappen} alt="Wappen" style={{ height: '60px', width: 'auto' }} />
        </div>
        <p style={{ 
          margin: '10px 0 0 0', 
          fontSize: '16px',
          color: '#666',
          fontWeight: 'bold'
        }}>
          Namen anklicken → Preis wählen
        </p>
      </header>

      {!selectedMember ? (
        <>
          {/* Member Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '8px',
            marginBottom: '40px'
          }}>
            {mockMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => handleMemberClick(member)}
                style={{
                  padding: '12px',
                  border: '3px solid #dc2626',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  minHeight: '55px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#333'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#333';
                }}
              >
                {member.name}
              </button>
            ))}
          </div>

          {/* Today's Orders */}
          {orders.length > 0 && (
            <div style={{
              marginTop: '40px',
              border: '3px solid #dc2626',
              backgroundColor: '#ffffff',
              padding: '20px'
            }}>
              <h2 style={{ 
                margin: '0 0 15px 0',
                fontSize: '18px',
                borderBottom: '2px solid #dc2626',
                paddingBottom: '10px',
                color: '#dc2626',
                fontWeight: 'bold'
              }}>
                HEUTE ({totalToday.toFixed(2)}€)
              </h2>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {orders.slice(0, 10).map((order, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: index < orders.length - 1 ? '1px solid #dc2626' : 'none',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#666' }}>{order.time}</span>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>{order.member}</span>
                    <span style={{ fontWeight: 'bold', color: '#dc2626' }}>
                      {order.amount.toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Price Selection */
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '28px',
            marginBottom: '30px',
            color: '#dc2626',
            fontWeight: 'bold',
            padding: '15px',
            border: '3px solid #dc2626',
            backgroundColor: '#ffffff'
          }}>
            {selectedMember.name}
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '30px'
          }}>
            {/* 1,00€ - Orange */}
            <button
              onClick={() => handlePriceClick(1.00)}
              style={{
                padding: '25px 35px',
                border: '4px solid #dc2626',
                backgroundColor: '#ff8c00',
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold',
                minWidth: '140px',
                color: '#ffffff',
                position: 'relative'
              }}
            >
              1,00€
              {selectedDrinks[1.00] > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  border: '3px solid #ffffff'
                }}>
                  {selectedDrinks[1.00]}
                </span>
              )}
            </button>
            
            {/* 0,65€ - Schwarz */}
            <button
              onClick={() => handlePriceClick(0.65)}
              style={{
                padding: '25px 35px',
                border: '4px solid #dc2626',
                backgroundColor: '#000000',
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold',
                minWidth: '140px',
                color: '#ffffff',
                position: 'relative'
              }}
            >
              0,65€
              {selectedDrinks[0.65] > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  border: '3px solid #ffffff'
                }}>
                  {selectedDrinks[0.65]}
                </span>
              )}
            </button>
            
            {/* 0,45€ - Weiß */}
            <button
              onClick={() => handlePriceClick(0.45)}
              style={{
                padding: '25px 35px',
                border: '4px solid #dc2626',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold',
                minWidth: '140px',
                color: '#000000',
                position: 'relative'
              }}
            >
              0,45€
              {selectedDrinks[0.45] > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  border: '3px solid #ffffff'
                }}>
                  {selectedDrinks[0.45]}
                </span>
              )}
            </button>
          </div>
          
          {getTotalSelected() > 0 && (
            <>
              {/* Order Summary */}
              <div style={{
                border: '3px solid #dc2626',
                backgroundColor: '#ffffff',
                padding: '20px',
                marginBottom: '20px',
                maxWidth: '400px',
                margin: '0 auto 20px auto'
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  fontSize: '18px',
                  color: '#dc2626',
                  fontWeight: 'bold',
                  borderBottom: '2px solid #dc2626',
                  paddingBottom: '10px'
                }}>
                  BESTELLUNG:
                </h3>
                {Object.entries(selectedDrinks)
                  .filter(([_, count]) => count > 0)
                  .map(([price, count]) => {
                    const priceNum = parseFloat(price);
                    const total = priceNum * count;
                    return (
                      <div key={price} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        fontSize: '16px',
                        color: '#333'
                      }}>
                        <span style={{ fontWeight: 'bold' }}>
                          {count}x {priceNum.toFixed(2)}€
                        </span>
                        <span style={{ fontWeight: 'bold' }}>
                          = {total.toFixed(2)}€
                        </span>
                      </div>
                    );
                  })}
                <div style={{
                  borderTop: '3px solid #dc2626',
                  marginTop: '10px',
                  paddingTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#dc2626'
                }}>
                  <span>GESAMT:</span>
                  <span>
                    {Object.entries(selectedDrinks)
                      .reduce((sum, [price, count]) => sum + (parseFloat(price) * count), 0)
                      .toFixed(2)}€
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                style={{
                  padding: '20px 40px',
                  border: '4px solid #dc2626',
                  backgroundColor: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '20px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
              >
                ✓ BESTÄTIGEN ({getTotalSelected()} Getränk{getTotalSelected() > 1 ? 'e' : ''})
              </button>
            </>
          )}
          
          <br />
          
          <button
            onClick={() => {
              setSelectedMember(null);
              setSelectedDrinks({ 1.00: 0, 0.65: 0, 0.45: 0 });
            }}
            style={{
              padding: '12px 25px',
              border: '3px solid #666',
              backgroundColor: '#f0f0f0',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#666'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#666';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.color = '#666';
            }}
          >
            ← Zurück zur Tafel
          </button>
        </div>
      )}
    </div>
  );
}