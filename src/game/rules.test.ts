import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateHiddenCharacter,
  getProgressiveDiscovery,
  evaluateDestinyEncounter,
  resolveBreakthrough,
  worldToIso,
  isoToWorld,
  calculateSkillDamage,
  COMBAT_SKILLS,
} from './rules';

test('Hidden Spiritual Root generator is deterministic per Fate Seed and balances underdog roots', () => {
  const charA1 = generateHiddenCharacter('HAN-LAP-777');
  const charA2 = generateHiddenCharacter('HAN-LAP-777');
  assert.equal(charA1.spiritualRoot.id, charA2.spiritualRoot.id);
  assert.equal(charA1.hiddenConstitution, charA2.hiddenConstitution);
  assert.equal(charA1.comprehension, charA2.comprehension);

  // Verify every generated character has valid bounded attributes
  assert.ok(charA1.rootPurity >= 50 && charA1.rootPurity <= 100);
  assert.ok(charA1.comprehension >= 50);
  assert.ok(charA1.fortune >= 50);
});

test('Progressive Self-Discovery hides Spiritual Root at Mortal stage and reveals progressively by realm', () => {
  const char = generateHiddenCharacter('TIEN-DO-SEED-2026');

  // Stage 0: Mortal (Phàm Nhân)
  const mortalView = getProgressiveDiscovery(char, 0, 1, 0);
  assert.equal(mortalView.stage, 0);
  assert.equal(mortalView.visibleRootName, 'Ẩn Số Thiên Cơ (Chưa Biết)');
  assert.equal(mortalView.canPerformRitual, false);

  // Stage 1: Luyện Khí Tầng 2
  const qiEarly = getProgressiveDiscovery(char, 1, 2, 0);
  assert.equal(qiEarly.stage, 1);
  assert.equal(qiEarly.visibleClue, char.spiritualRoot.vagueSensation);

  // Stage 2: Luyện Khí Tầng 5
  const qiMid = getProgressiveDiscovery(char, 1, 5, 0);
  assert.equal(qiMid.stage, 2);
  assert.ok(qiMid.visibleRootName.includes(char.spiritualRoot.elements[0]));

  // Stage 4: Luyện Khí Đại Viên Mãn (Tầng 12)
  const qiPeak = getProgressiveDiscovery(char, 1, 12, 0);
  assert.equal(qiPeak.stage, 4);
  assert.equal(qiPeak.visibleRootName, char.spiritualRoot.name);
  assert.equal(qiPeak.canPerformRitual, true);

  // Stage 5: Trúc Cơ (Realm 2) unlocks Constitution & Bloodline
  const foundationView = getProgressiveDiscovery(char, 2, 1, 0);
  assert.equal(foundationView.stage, 5);
  assert.ok(foundationView.visibleConstitution.includes(char.hiddenConstitution));
  assert.ok(foundationView.visibleBloodline.includes(char.hiddenBloodline));
});

test('Destiny & Fortune Engine deterministically triggers events and escalates with Pity/Fortune', () => {
  const char = generateHiddenCharacter('DESTINY-ENGINE-TEST');
  const ev1 = evaluateDestinyEncounter(char, 1);
  assert.ok(ev1.choices.length >= 2);

  // High pity counter forces high-rarity destiny encounter
  const luckyChar = { ...char, pityCounter: 10, fortune: 180, karma: 50 };
  const rareEv = evaluateDestinyEncounter(luckyChar, 2);
  assert.equal(rareEv.rarity, 'Cơ Duyên Nghịch Thiên');
});

test('Breakthrough & Tribulation system resolves minor and major realm breakthroughs properly', () => {
  const char = generateHiddenCharacter('BREAKTHROUGH-SEED');

  // Minor sub-level breakthrough in Luyện Khí (1 -> 2)
  const minorRes = resolveBreakthrough({
    realmIndex: 1,
    subLevel: 1,
    currentQi: 200,
    requiredQi: 180,
    foundationStability: 80,
    mentalState: 85,
    pillsUsed: 0,
    locationBonus: 0.05,
    tribulationSurvivalRatio: 1.0,
    spiritualRoot: char.spiritualRoot,
    fateSeed: char.fateSeed,
  });
  assert.equal(minorRes.outcome, 'SUCCESS');
  assert.equal(minorRes.newRealmIndex, 1);
  assert.equal(minorRes.newSubLevel, 2);

  // Major realm breakthrough from Luyện Khí Tầng 12 -> Trúc Cơ with full preparation
  const majorRes = resolveBreakthrough({
    realmIndex: 1,
    subLevel: 12,
    currentQi: 500,
    requiredQi: 400,
    foundationStability: 95,
    mentalState: 95,
    pillsUsed: 3,
    locationBonus: 0.15,
    tribulationSurvivalRatio: 1.0,
    spiritualRoot: char.spiritualRoot,
    fateSeed: 'GUARANTEED-PASS',
  });
  assert.ok(majorRes.finalSuccessProbability > 0.9);
  assert.equal(majorRes.newRealmIndex, 2);
  assert.equal(majorRes.newSubLevel, 1);
});

test('2.5D Isometric coordinate projection round-trips accurately and skill damage scales', () => {
  const { isoX, isoY } = worldToIso(320, 180, 0);
  const { wx, wy } = isoToWorld(isoX, isoY);
  assert.ok(Math.abs(wx - 320) < 1e-6);
  assert.ok(Math.abs(wy - 180) < 1e-6);

  const char = generateHiddenCharacter('COMBAT-TEST');
  const dmg1 = calculateSkillDamage(COMBAT_SKILLS[0], char, 0, 1);
  const dmg2 = calculateSkillDamage(COMBAT_SKILLS[0], char, 2, 1);
  assert.ok(dmg2 > dmg1);
});
