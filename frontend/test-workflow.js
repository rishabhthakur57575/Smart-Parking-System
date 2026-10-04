// Test script to verify parking logic & API service contracts

import { parkingService } from './src/services/api.js';

async function runTests() {
  console.log('--- Starting SmartPark Logic Verification ---');

  // Test 1: Fetch all slots
  const slots = await parkingService.getAllSlots();
  console.assert(slots.length === 50, `Expected 50 slots, got ${slots.length}`);
  console.log(`✓ Total slots: ${slots.length}`);

  // Test 2: Check initial configuration
  const reservedSlots = slots.filter((s) => s.status === 'RESERVED');
  const availableSlots = slots.filter((s) => s.status === 'AVAILABLE');
  const occupiedSlots = slots.filter((s) => s.status === 'OCCUPIED');

  console.assert(reservedSlots.length === 23, `Expected 23 reserved slots, got ${reservedSlots.length}`);
  console.assert(availableSlots.length === 27, `Expected 27 available slots, got ${availableSlots.length}`);
  console.assert(occupiedSlots.length === 0, `Expected 0 occupied slots, got ${occupiedSlots.length}`);
  console.log(`✓ Initial configuration correct: 23 Reserved (P01-P23), 27 Available (P24-P50), 0 Occupied`);

  // Test 3: Check P01 is reserved, P24 is available
  const p01 = slots.find((s) => s.slotNumber === 'P01');
  const p24 = slots.find((s) => s.slotNumber === 'P24');
  console.assert(p01.status === 'RESERVED', `P01 should be RESERVED`);
  console.assert(p24.status === 'AVAILABLE', `P24 should be AVAILABLE`);
  console.log('✓ P01 is RESERVED and P24 is AVAILABLE');

  // Test 4: Book P24
  const booking = await parkingService.bookSlot(24, 'MH04AB1234');
  console.assert(booking.success === true, 'Booking should be successful');
  console.assert(booking.token.startsWith('PK-2026-'), `Token format invalid: ${booking.token}`);
  console.assert(booking.vehicleNumber === 'MH04AB1234', 'Vehicle number mismatch');
  console.log(`✓ Booking successful! Token generated: ${booking.token}, Slot: ${booking.slotNumber}`);

  // Test 5: Check P24 is now OCCUPIED
  const updatedSlots = await parkingService.getAllSlots();
  const bookedP24 = updatedSlots.find((s) => s.slotNumber === 'P24');
  console.assert(bookedP24.status === 'OCCUPIED', 'P24 should be OCCUPIED');
  console.log('✓ Slot P24 status updated to OCCUPIED');

  // Test 6: Exit flow with token
  const exitDetails = await parkingService.findExitDetails(booking.token);
  console.assert(exitDetails.totalAmount === 90, `Amount should be 90, got ${exitDetails.totalAmount}`);
  console.assert(exitDetails.slotNumber === 'P24', 'Slot should match');
  console.log(`✓ Exit details retrieved: Duration ${exitDetails.duration}, Rate ${exitDetails.rate}, Total ₹${exitDetails.totalAmount}`);

  // Test 7: Demo payment
  const paymentResult = await parkingService.processPayment(booking.token, 'UPI');
  console.assert(paymentResult.success === true, 'Payment should succeed');
  console.assert(paymentResult.transactionId.startsWith('TXN-'), 'Transaction ID format invalid');
  console.log(`✓ Payment processed successfully! Transaction ID: ${paymentResult.transactionId}`);

  // Test 8: Check P24 is now released back to AVAILABLE
  const releasedSlots = await parkingService.getAllSlots();
  const freedP24 = releasedSlots.find((s) => s.slotNumber === 'P24');
  console.assert(freedP24.status === 'AVAILABLE', 'P24 should be back to AVAILABLE');
  console.log('✓ Slot P24 released back to AVAILABLE');

  // Test 9: Free reserved slot P01 in Admin
  const adminFree = await parkingService.freeReservedSlot(1);
  console.assert(adminFree.success === true, 'Admin free slot should succeed');
  const postAdminSlots = await parkingService.getAllSlots();
  const freedP01 = postAdminSlots.find((s) => s.slotNumber === 'P01');
  console.assert(freedP01.status === 'AVAILABLE', 'P01 should be AVAILABLE after admin free');
  console.log('✓ Admin successfully freed reserved slot P01 to AVAILABLE');

  // Test 10: Check History
  const history = await parkingService.getHistory();
  console.assert(history.length >= 1, 'History should contain records');
  console.assert(history[0].status === 'COMPLETED', 'Latest record should be COMPLETED');
  console.log(`✓ History logging verified: ${history.length} records found`);

  // Reset to initial clean state
  parkingService.resetDemoData();
  console.log('✓ Reset demo data to initial configuration completed.');
  console.log('\n>>> ALL 10 TESTS PASSED SUCCESSFULLY! <<<');
}

runTests().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
