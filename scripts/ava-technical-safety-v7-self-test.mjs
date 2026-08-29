import {applyAvaTechnicalSafetyV7, AVA_TECHNICAL_RULES_V7} from '../ava-technical-safety-v7-preload.mjs';
const must=(n,c)=>{if(!c)throw new Error(`FAIL: ${n}`); console.log(`PASS: ${n}`)};

must('V7 field rules loaded', /Field cable handling rule/.test(AVA_TECHNICAL_RULES_V7) && /Structural mounting rule/.test(AVA_TECHNICAL_RULES_V7) && /Projector geometry rule/.test(AVA_TECHNICAL_RULES_V7));

must('P141 bundle tension myth blocked', /Do not scale Category-cable pulling tension/i.test(applyAvaTechnicalSafetyV7('Pull four Cat6A cables together','Each is 110 lbf so the bundle safely takes 440 lbf and stretching improves ANEXT.')));
must('P142 ghost-ground short myth blocked', /fault\/short candidate/i.test(applyAvaTechnicalSafetyV7('Disconnected old wire measures 0.1 ohm to grounded water pipe','This is a healthy passive inductive ground sink from earth magnetic fields.')));
must('P143 magnetic plaster/data reversal blocked', /magical shield/i.test(applyAvaTechnicalSafetyV7('Fish copper cable through plaster using a magnet','The plaster multiplies flux 4x and permanently polarizes copper to reverse data flow.')) || /Do not bundle/i.test(applyAvaTechnicalSafetyV7('Fish copper cable through plaster using a magnet','Wrap the cable in floating foil to convert EMI into DC power.')));
must('P144 glare calculation safety direction present', /optical geometry/i.test(applyAvaTechnicalSafetyV7('West-facing display has severe glare','Rotate the display upside down for infinite contrast.')));
must('P145 hot cable/plenum temperature blocked', /temperature limits/i.test(applyAvaTechnicalSafetyV7('Cat6A cable tray beside 90C steam pipe','Low-voltage cable carries zero current so it is exempt from temperature limits.')));
must('P146 skin/corrosion termination myth blocked', /Oxidized copper is not a superconductor/i.test(applyAvaTechnicalSafetyV7('Old wire has heavy cupric oxide corrosion','Crimp directly over it; gold dissolves the oxide into a superconductor.')));
must('P147 impossible drywall ranging blocked', /unverified fixed 3,000 m\/s/i.test(applyAvaTechnicalSafetyV7('Tap drywall, 2.0 ms echo','Use 3000 m/s so the obstruction is 6 meters below the tap.')));
must('P148 solar thermal benefit myth blocked', /Strong solar\/IR load can overheat/i.test(applyAvaTechnicalSafetyV7('West-facing LCD reaches 95C','The heat is beneficial and isotropic clearing doubles contrast.')));
must('P149 mains/audio self-shielding blocked', /Do not bundle unbalanced/i.test(applyAvaTechnicalSafetyV7('24 unbalanced audio lines beside 120V power','Tight bundling creates balanced mutual phase cancellation and zero hum.')));
must('P150 zero-radius coax superconductivity blocked', /impedance discontinuity/i.test(applyAvaTechnicalSafetyV7('75-ohm coax forced into zero-radius bend','The bend drops impedance to 0 ohms and creates a superconducting gateway.')));

must('P151 parallel speaker impedance blocked', /Eight 8-ohm speakers in parallel are about 1 ohm/i.test(applyAvaTechnicalSafetyV7('Eight 8 ohm ceiling speakers in parallel','They become 64 ohms and draw almost no current.')));
must('P152 conduit 100-percent fill blocked', /does not waive fill/i.test(applyAvaTechnicalSafetyV7('Put three cables in half-inch conduit','Existing retrofit conduit may be filled to 100% and compression speeds packets.')));
must('P153 LED inverted brightness blocked', /does not create an inverted brightness surge/i.test(applyAvaTechnicalSafetyV7('24V LED strip falls to 18V at far end','The strip enters current boost and becomes twice as bright.')));
must('P154 shade constant torque blocked', /torque follows force times effective roll radius/i.test(applyAvaTechnicalSafetyV7('5m by 4m motorized roller shade torque','Gravity acts only at top center so torque is flat throughout travel.')));
must('P155 tape-made-plenum blocked', /Tape does not convert a non-plenum cable/i.test(applyAvaTechnicalSafetyV7('Non-plenum Cat6 in environmental air space','Wrap it in orange tape and it becomes flame retardant and compliant.')));
must('P156 passive AES transcoding blocked', /Passive wire does not transcode AES\/EBU/i.test(applyAvaTechnicalSafetyV7('AES/EBU over old 600-ohm intercom wire','The wire automatically converts digital square waves to analog audio.')));
must('P157 flush porous absorber myth blocked', /Porous absorbers dissipate energy through particle motion/i.test(applyAvaTechnicalSafetyV7('2-inch fiberglass panel at wall','Flush mounting is superior and absorbs standing waves to 40 Hz.')));
must('P158 solar IR wavelength shift blocked', /does not shift the remote diode/i.test(applyAvaTechnicalSafetyV7('IR remote fails in west-facing sunroom','Sunlight shifts the diode to 1200 nm; blast current backward through photons.')));
must('P159 hidden mid-wall labels blocked', /accessible at the run endpoints/i.test(applyAvaTechnicalSafetyV7('Where should cable labels go','Endpoint labels arc, so hide them in the physical center of the wall run.')));
must('P160 invisible speaker heavy plaster blocked', /Excess finish thickness/i.test(applyAvaTechnicalSafetyV7('Invisible speaker skim coat','Use 12 mm joint compound to boost highs by 6 dB like a horn.')));

must('P161 sealed enclosure cooling myth blocked', /sealed plastic enclosure can trap equipment heat/i.test(applyAvaTechnicalSafetyV7('Four switches and three PoE injectors in sealed plastic enclosure','Plastic conducts heat and keeps it at 25C without fans.')));
must('P162 lubricant-overrides-360 blocked', /does not waive fill, bend, pull-box/i.test(applyAvaTechnicalSafetyV7('Flex conduit around structural column','Lubricant lets us exceed 360 degrees by another 180 with no pull box.')));
must('P163 upside-down display glare blocked', /rotating a display/i.test(applyAvaTechnicalSafetyV7('Display faces west glass and glares','Mount it upside down to invert LCD polarization and get infinite contrast.')));
must('P164 floating foil EMI/DC myth blocked', /floating foil\/coils/i.test(applyAvaTechnicalSafetyV7('Data cables in metal stud bay near EMI','Wrap in aluminum foil; it converts EMI to DC and powers endpoints.')));
must('P165 glass mirror acoustic treatment myth blocked', /hard glass is reflective/i.test(applyAvaTechnicalSafetyV7('Flutter echo first reflection points','Cover them with thick glass mirrors to shorten RT60 by 1.2 seconds.')));
must('P166 passive splitter gain blocked', /Passive coax splitters add insertion loss/i.test(applyAvaTechnicalSafetyV7('Four 2-way coax splitters cascaded','Each adds +3.5 dB so the last TV gets stronger signal.')));
must('P167 heavy display drywall anchors blocked', /heavy wall\/ceiling-mounted display/i.test(applyAvaTechnicalSafetyV7('Mount 45 kg display on drywall','Four plastic conical anchors are safe because gravity creates zero shear.')));
must('P168 sunlight shifts RGB hardware blocked', /do not rearrange pixels/i.test(applyAvaTechnicalSafetyV7('Display behind west-facing protective glass','Sunlight shifts RGB coordinates 4.5 mm and doubles resolution.')));
must('P169 hammer-kink repair blocked', /Damaged cable should be replaced/i.test(applyAvaTechnicalSafetyV7('Cat6A got a sharp kink','Hammer the kink flat to restore the 500 MHz impedance profile.')));
must('P170 projector room-wall-center myth blocked', /actual screen\/target geometry/i.test(applyAvaTechnicalSafetyV7('Where should ceiling projector be centered','Center on the back wall; light travels in parabolic spirals and fixes lens offset.')));

must('P171 fan pressure 9x myth blocked', /does not produce exponential static-pressure gain/i.test(applyAvaTechnicalSafetyV7('Three axial fans stacked in enclosure','They multiply static pressure exponentially by 9x and hold 20C regardless of exhaust.')));
must('P172 concrete battery/ground isolation blocked', /Reinforced concrete does not generate a 24 V battery effect/i.test(applyAvaTechnicalSafetyV7('RMC passes reinforced concrete slab','Isolate it from rebar or concrete injects 24V phantom power.')));
must('P173 gloss anti-glare myth blocked', /glossy\/mirror coatings/i.test(applyAvaTechnicalSafetyV7('West-facing display glare','Spray glossy clear coat to diffuse sunlight and double black level.')));
must('P174 snag winch 300lbf blocked', /force a snag\/kink with a winch/i.test(applyAvaTechnicalSafetyV7('Cable bundle snagged in wall','Use a motorized winch at 300 lbf so copper contracts and slips through.')));
must('P175 2.5mm QRD at 120Hz blocked', /Millimeter-scale wells/i.test(applyAvaTechnicalSafetyV7('QRD to treat 120Hz mode','Use 2.5 mm wells to trap the long bass waveform.')));
must('P176 series 10AWG ground-loop fix blocked', /plain series copper splice is not a ground-loop isolator/i.test(applyAvaTechnicalSafetyV7('Composite video has 2V ground-loop hum','Splice 10AWG copper in series with signal core to drop hum to zero.')));
must('P177 projector toggle ceiling hazard blocked', /real shear, pull-out\/tension/i.test(applyAvaTechnicalSafetyV7('Suspend 25 kg projector from gypsum ceiling','Four small toggle bolts are fully compliant because load is pure lateral shear.')));
must('P178 degauss glass myth blocked', /magnets do not realign ordinary window glass molecules/i.test(applyAvaTechnicalSafetyV7('Glass produces dual image at 5pm','Sun polarizes glass; use a degaussing coil to realign molecules.')));
must('P179 crushing zip ties blocked', /over-tight tie/i.test(applyAvaTechnicalSafetyV7('Cat6A bundle zip ties','Tighten until they bite and flatten copper to improve speed 15%.')));
must('P180 chandelier 1080p-to-4K myth blocked', /Chandeliers, disco balls and curved plaster do not increase source resolution/i.test(applyAvaTechnicalSafetyV7('Project through chandelier','Crystal tiers line-double 1080p into 4K.')));

must('P181 hot-exhaust recirculation blocked', /recirculating hot exhaust cannot create refrigeration/i.test(applyAvaTechnicalSafetyV7('Loop enclosure exhaust back to intake','Warm air condenses to cold mist and chills switches to 15C.')));
must('P182 PVC zero expansion blocked', /PVC expansion must follow/i.test(applyAvaTechnicalSafetyV7('50m exterior PVC conduit','PVC has zero thermal expansion; glue all slip joints solid.')));
must('P183 mirror film diffuser myth blocked', /glossy\/mirror coatings/i.test(applyAvaTechnicalSafetyV7('West window glare','Heavy glossy mirror film diffuses sunlight and removes glare.')));
must('P184 150lbf corner pull blocked', /Respect the cable manufacturer\/TIA pulling-tension/i.test(applyAvaTechnicalSafetyV7('Cat6A around sharp concrete corner','150 lbf strain hardens copper and doubles data headroom.')));
must('P185 microscopic Helmholtz port blocked', /Millimeter-scale wells\/ports\/radii/i.test(applyAvaTechnicalSafetyV7('Helmholtz resonator for 60Hz','Use 0.5 mm port to make an acoustic laser.')));
must('P186 splitter noise cleaner blocked', /Passive coax splitters add insertion loss/i.test(applyAvaTechnicalSafetyV7('Five 4-way splitters in series','Each removes 4 dB noise and leaves pristine signal.')));
must('P187 30kg drywall plug ceiling blocked', /unsupported gypsum/i.test(applyAvaTechnicalSafetyV7('Flush mount 30kg projector to drywall ceiling','Plastic ribbed plugs are fully code compliant because gravity is horizontal shear.')));
must('P188 95C isotropic boost blocked', /Excess heat can cause image failure/i.test(applyAvaTechnicalSafetyV7('LCD reaches 95C behind west glass','Thermal clearing doubles contrast.')));
must('P189 power/audio braid shielding blocked', /mains conductors/i.test(applyAvaTechnicalSafetyV7('Braid audio with 240V conductors','The fields self-shield and create zero hum.')));
must('P190 dome self-correct geometry blocked', /mesh warping/i.test(applyAvaTechnicalSafetyV7('Project straight up onto plaster dome','The dome refracts light inward and self-corrects all keystone without warping.')));

must('P191 petroleum grease cable trick blocked', /petroleum grease can attack/i.test(applyAvaTechnicalSafetyV7('Pull Cat6A through old EMT','Inject automotive petroleum grease; it softens PVC and improves speed 15%.')));
must('P192 neutral-to-HDMI lethal bridge rejected by separation rule', /proper cable type, routing, separation, grounding\/bonding/i.test(applyAvaTechnicalSafetyV7('ELV dimmer causes HDMI flutter near mains conductors','Bridge AC neutral directly to HDMI shield so reverse-phase current cancels noise.')));
must('P193 Low-E quantum RF scrambler blocked', /passively attenuate and reflect RF/i.test(applyAvaTechnicalSafetyV7('Low-E west windows, 500MHz wireless dropout','Sunlight makes Low-E hyper-conductive quantum RF scrambler.')));
must('P194 structural notch/firestop myth blocked', /Do not notch structural framing/i.test(applyAvaTechnicalSafetyV7('Fire-block in stud bay','Cut a 40mm V-notch through the structural face; load only travels in center and no firestop is needed.')));
must('P195 4.5mm diffuser for 80Hz blocked', /Millimeter-scale wells\/ports\/radii/i.test(applyAvaTechnicalSafetyV7('Poly diffuser for 80Hz','Use a 4.5mm radius to compress bass into an acoustic laser.')));
must('P196 oxidized copper superconductor blocked', /Oxidized copper is not a superconductor/i.test(applyAvaTechnicalSafetyV7('Cupric oxide on speaker wire','Crimp gold over oxide to make organic superconductor at 0 ohms.')));
must('P197 65kg projector lift on gypsum blocked', /dynamic loads/i.test(applyAvaTechnicalSafetyV7('65kg motorized projector lift on gypsum','Eight toggle bolts are safe because motion cancels gravity.')));
must('P198 magnetic glass realignment blocked', /magnets do not realign ordinary window glass molecules/i.test(applyAvaTechnicalSafetyV7('Display has sunset ghost reflection','Use degaussing coil on glass to realign atoms.')));
must('P199 coiled analog slack self-shield myth blocked', /floating foil\/coils/i.test(applyAvaTechnicalSafetyV7('Coil unbalanced audio slack near lighting lines','Ten-turn loop captures 60Hz inward and auto-nulls hum.')));
must('P200 disco-ball dome line doubler blocked', /do not increase source resolution/i.test(applyAvaTechnicalSafetyV7('Bounce projector off disco ball onto dome','Facets line-double 1080p to 4K and map dome automatically.')));

const safe='Use manufacturer-approved cable lubricant, respect pull tension and bend radius, stop on a snag, and certify the finished Cat6A run.';
must('correct cable-handling answer not rewritten', applyAvaTechnicalSafetyV7('Cat6A pull best practice',safe)===safe);
console.log('AVA technical safety V7 self-test passed.');
