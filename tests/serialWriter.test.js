import test from 'node:test';
import assert from 'node:assert/strict';
import {createSerialWriter} from '../src/data/serialWriter.js';
test('rapid preference updates use the previous committed value and recover from failures',async()=>{
  let value={email:true,sms:true};
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  let calls=0;
  const saved=[];
  const write=createSerialWriter(()=>value,async next=>{
    calls++;
    if(calls===1) await gate;
    if(calls===3) throw new Error('Offline');
    saved.push(next);
  },next=>{value=next;});
  const first=write(previous=>({...previous,email:false}));
  const second=write(previous=>({...previous,sms:false}));
  release();await Promise.all([first,second]);
  assert.deepEqual(value,{email:false,sms:false});
  await assert.rejects(write({email:true,sms:true}),/Offline/);
  await write(previous=>({...previous,email:true}));
  assert.deepEqual(value,{email:true,sms:false});
  assert.equal(saved.length,3);
});
