import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 بدء تهيئة قاعدة البيانات...\n');

    // ─── 1. Admin User ───────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.upsert({
        where: { username: 'admin' },
        update: {},
        create: { username: 'admin', password: hashedPassword, name: 'مدير النظام' },
    });
    console.log('✅ مدير النظام: admin / admin123');

    // ─── 2. Governorates ─────────────────────────────────────────────────────
    const governorateNames = [
        'دمشق', 'ريف دمشق', 'حلب', 'حمص', 'حماة',
        'اللاذقية', 'طرطوس', 'إدلب', 'دير الزور', 'الرقة',
        'الحسكة', 'درعا', 'السويداء', 'القنيطرة',
    ];

    const govs: Record<string, number> = {};
    for (let i = 0; i < governorateNames.length; i++) {
        const g = await prisma.governorate.upsert({
            where: { id: i + 1 },
            update: {},
            create: { name: governorateNames[i], order: i, isActive: true },
        });
        govs[governorateNames[i]] = g.id;
    }
    console.log(`✅ ${governorateNames.length} محافظة`);

    // ─── 3. Categories (3 levels) ────────────────────────────────────────────
    // Level 1
    const catL1 = [
        { name: 'مطاعم وكافيهات',    icon: '🍽️', order: 0 },
        { name: 'محلات تجارية',      icon: '🏪', order: 1 },
        { name: 'أطباء ومستشفيات',  icon: '🏥', order: 2 },
        { name: 'تعليم وتدريب',      icon: '🎓', order: 3 },
        { name: 'سيارات ومحركات',    icon: '🚗', order: 4 },
        { name: 'عقارات',            icon: '🏠', order: 5 },
        { name: 'خدمات منزلية',      icon: '🔧', order: 6 },
        { name: 'جمال وعناية',       icon: '💆', order: 7 },
        { name: 'رياضة وترفيه',      icon: '⚽', order: 8 },
        { name: 'سفر وسياحة',        icon: '✈️', order: 9 },
    ];

    const l1: Record<string, number> = {};
    for (const c of catL1) {
        const created = await prisma.category.upsert({
            where: { id: (catL1.indexOf(c) + 1) * 100 },
            update: {},
            create: { id: (catL1.indexOf(c) + 1) * 100, name: c.name, icon: c.icon, level: 1, order: c.order, isActive: true },
        });
        l1[c.name] = created.id;
    }

    // Level 2 structure
    const catL2: { name: string; icon: string; order: number; parent: string }[] = [
        // مطاعم وكافيهات
        { name: 'مطاعم شرقية',   icon: '🥙', order: 0, parent: 'مطاعم وكافيهات' },
        { name: 'مطاعم غربية',   icon: '🍔', order: 1, parent: 'مطاعم وكافيهات' },
        { name: 'مشاوي وأفران',  icon: '🔥', order: 2, parent: 'مطاعم وكافيهات' },
        { name: 'حلويات ومخابز', icon: '🍰', order: 3, parent: 'مطاعم وكافيهات' },
        { name: 'كافيهات',       icon: '☕', order: 4, parent: 'مطاعم وكافيهات' },
        // محلات تجارية
        { name: 'ألبسة وأزياء',  icon: '👔', order: 0, parent: 'محلات تجارية' },
        { name: 'إلكترونيات',    icon: '📱', order: 1, parent: 'محلات تجارية' },
        { name: 'أحذية وحقائب',  icon: '👟', order: 2, parent: 'محلات تجارية' },
        { name: 'مجوهرات وساعات',icon: '💍', order: 3, parent: 'محلات تجارية' },
        { name: 'مواد غذائية',   icon: '🛒', order: 4, parent: 'محلات تجارية' },
        // أطباء
        { name: 'طب القلب',      icon: '❤️', order: 0, parent: 'أطباء ومستشفيات' },
        { name: 'طب الأسنان',    icon: '🦷', order: 1, parent: 'أطباء ومستشفيات' },
        { name: 'طب العيون',     icon: '👁️', order: 2, parent: 'أطباء ومستشفيات' },
        { name: 'طب الأطفال',    icon: '👶', order: 3, parent: 'أطباء ومستشفيات' },
        { name: 'جراحة عامة',    icon: '🩺', order: 4, parent: 'أطباء ومستشفيات' },
        { name: 'طب النساء',     icon: '🌸', order: 5, parent: 'أطباء ومستشفيات' },
        // تعليم
        { name: 'مدارس',         icon: '🏫', order: 0, parent: 'تعليم وتدريب' },
        { name: 'جامعات',        icon: '🎓', order: 1, parent: 'تعليم وتدريب' },
        { name: 'مراكز تدريب',   icon: '💻', order: 2, parent: 'تعليم وتدريب' },
        { name: 'دروس خصوصية',   icon: '📚', order: 3, parent: 'تعليم وتدريب' },
        // سيارات
        { name: 'معارض سيارات',  icon: '🚘', order: 0, parent: 'سيارات ومحركات' },
        { name: 'كراجات وصيانة', icon: '🔩', order: 1, parent: 'سيارات ومحركات' },
        { name: 'قطع غيار',      icon: '⚙️', order: 2, parent: 'سيارات ومحركات' },
        // عقارات
        { name: 'شقق للبيع',     icon: '🏢', order: 0, parent: 'عقارات' },
        { name: 'شقق للإيجار',   icon: '🔑', order: 1, parent: 'عقارات' },
        { name: 'أراضي',         icon: '🌍', order: 2, parent: 'عقارات' },
        // خدمات منزلية
        { name: 'سباكة',         icon: '🚰', order: 0, parent: 'خدمات منزلية' },
        { name: 'كهرباء',        icon: '⚡', order: 1, parent: 'خدمات منزلية' },
        { name: 'تنظيف',         icon: '🧹', order: 2, parent: 'خدمات منزلية' },
        // جمال
        { name: 'صالونات نساء',  icon: '💅', order: 0, parent: 'جمال وعناية' },
        { name: 'حلاقة رجالية',  icon: '✂️', order: 1, parent: 'جمال وعناية' },
        { name: 'مراكز تجميل',   icon: '🪞', order: 2, parent: 'جمال وعناية' },
        // رياضة
        { name: 'صالات رياضية',  icon: '💪', order: 0, parent: 'رياضة وترفيه' },
        { name: 'ملاعب',         icon: '⚽', order: 1, parent: 'رياضة وترفيه' },
        { name: 'مسابح',         icon: '🏊', order: 2, parent: 'رياضة وترفيه' },
        // سفر
        { name: 'وكالات سفر',    icon: '🧳', order: 0, parent: 'سفر وسياحة' },
        { name: 'فنادق',         icon: '🏨', order: 1, parent: 'سفر وسياحة' },
    ];

    const l2: Record<string, number> = {};
    let l2Id = 1000;
    for (const c of catL2) {
        const created = await prisma.category.upsert({
            where: { id: l2Id },
            update: {},
            create: { id: l2Id, name: c.name, icon: c.icon, level: 2, order: c.order, parentId: l1[c.parent], isActive: true },
        });
        l2[c.name] = created.id;
        l2Id++;
    }

    // Level 3 structure
    const catL3: { name: string; icon: string; order: number; parent: string }[] = [
        // ألبسة
        { name: 'ألبسة رجالية',    icon: '👔', order: 0, parent: 'ألبسة وأزياء' },
        { name: 'ألبسة نسائية',    icon: '👗', order: 1, parent: 'ألبسة وأزياء' },
        { name: 'ألبسة أطفال',     icon: '🧒', order: 2, parent: 'ألبسة وأزياء' },
        { name: 'ملابس رياضية',    icon: '🏃', order: 3, parent: 'ألبسة وأزياء' },
        // إلكترونيات
        { name: 'هواتف ذكية',      icon: '📱', order: 0, parent: 'إلكترونيات' },
        { name: 'لابتوبات وحواسيب',icon: '💻', order: 1, parent: 'إلكترونيات' },
        { name: 'تلفزيونات وشاشات',icon: '📺', order: 2, parent: 'إلكترونيات' },
        { name: 'إكسسوارات',       icon: '🎧', order: 3, parent: 'إلكترونيات' },
        // مشاوي
        { name: 'شاورما',          icon: '🌯', order: 0, parent: 'مشاوي وأفران' },
        { name: 'كباب ومشاوي',     icon: '🍢', order: 1, parent: 'مشاوي وأفران' },
        { name: 'أفران خبز',       icon: '🥖', order: 2, parent: 'مشاوي وأفران' },
        // كراجات
        { name: 'صيانة محركات',    icon: '🔧', order: 0, parent: 'كراجات وصيانة' },
        { name: 'صيانة كهرباء',    icon: '⚡', order: 1, parent: 'كراجات وصيانة' },
        { name: 'إطارات وبطاريات', icon: '🛞', order: 2, parent: 'كراجات وصيانة' },
        // دروس
        { name: 'رياضيات وعلوم',   icon: '🔢', order: 0, parent: 'دروس خصوصية' },
        { name: 'لغة عربية',       icon: '📖', order: 1, parent: 'دروس خصوصية' },
        { name: 'لغة إنجليزية',    icon: '🇬🇧', order: 2, parent: 'دروس خصوصية' },
        // طب القلب
        { name: 'قثطرة قلبية',     icon: '❤️‍🩹', order: 0, parent: 'طب القلب' },
        { name: 'زراعة أوعية',     icon: '🫀', order: 1, parent: 'طب القلب' },
    ];

    let l3Id = 2000;
    const l3: Record<string, number> = {};
    for (const c of catL3) {
        if (l2[c.parent]) {
            const created = await prisma.category.upsert({
                where: { id: l3Id },
                update: {},
                create: { id: l3Id, name: c.name, icon: c.icon, level: 3, order: c.order, parentId: l2[c.parent], isActive: true },
            });
            l3[c.name] = created.id;
        }
        l3Id++;
    }

    const totalCats = catL1.length + catL2.length + catL3.length;
    console.log(`✅ ${totalCats} قسم (${catL1.length} رئيسي + ${catL2.length} فرعي + ${catL3.length} فرعي ثانٍ)`);

    // ─── 4. Listings ─────────────────────────────────────────────────────────
    await prisma.listing.deleteMany({});

    const listings = [
        // ── مطاعم شرقية
        {
            name: 'مطعم الشام الأصيل',
            description: 'مطعم شامي عريق يقدم أشهى المأكولات الشرقية التقليدية، من الفتة والمنسف إلى الكباب الدمشقي الأصيل. تجربة طعام لا تُنسى في قلب دمشق.',
            categoryId: l2['مطاعم شرقية'], governorateId: govs['دمشق'],
            phone: '0111234567', whatsapp: '963111234567', address: 'دمشق، باب توما، شارع الأرواد',
            locationLat: 33.5138, locationLng: 36.3117,
            isFeatured: true, isActive: true, viewCount: 1240,
        },
        {
            name: 'مطعم ألف ليلة',
            description: 'تراث دمشقي وأجواء شرقية أصيلة. نقدم أشهى أطباق المطبخ الشامي مع إطلالة رائعة على القلعة التاريخية.',
            categoryId: l2['مطاعم شرقية'], governorateId: govs['حلب'],
            phone: '0212345678', whatsapp: '963212345678', address: 'حلب، المدينة القديمة',
            isFeatured: true, isActive: true, viewCount: 980,
        },
        // ── مشاوي
        {
            name: 'مشاوي أبو علي',
            description: 'أشهر محل مشاوي في دمشق، شاورما وكباب طازجة على الفحم يومياً من الساعة 10 صباحاً.',
            categoryId: l3['كباب ومشاوي'] || l2['مشاوي وأفران'], governorateId: govs['دمشق'],
            phone: '0112345678', address: 'دمشق، الميدان',
            isFeatured: false, isActive: true, viewCount: 2100,
        },
        {
            name: 'شاورما الشهداء',
            description: 'أفضل شاورما عربي وتركي في حلب. خبرة 20 سنة.',
            categoryId: l3['شاورما'] || l2['مشاوي وأفران'], governorateId: govs['حلب'],
            phone: '0213456789', address: 'حلب، ساحة الشهداء',
            isFeatured: false, isActive: true, viewCount: 1560,
        },
        // ── كافيهات
        {
            name: 'كافيه لا بيلا',
            description: 'كافيه عصري بأجواء أوروبية، مشروبات ساخنة وباردة، حلويات يومية طازجة. مكان مثالي للعمل والاسترخاء.',
            categoryId: l2['كافيهات'], governorateId: govs['دمشق'],
            phone: '0991234567', whatsapp: '963991234567',
            instagram: 'labella.cafe', website: 'https://labella-cafe.sy',
            address: 'دمشق، المزة فيلات غربية', isFeatured: true, isActive: true, viewCount: 870,
        },
        // ── ألبسة رجالية
        {
            name: 'محل الأطرش للألبسة الرجالية',
            description: 'أفضل ماركات الألبسة الرجالية بأسعار منافسة. مجموعات موسمية وعروض مستمرة طوال العام.',
            categoryId: l3['ألبسة رجالية'] || l2['ألبسة وأزياء'], governorateId: govs['دمشق'],
            phone: '0911000001', whatsapp: '963911000001', address: 'دمشق، شارع الثورة',
            isFeatured: true, isActive: true, viewCount: 630,
        },
        {
            name: 'أزياء نور للنساء',
            description: 'أحدث صيحات الموضة النسائية. فساتين، عبايات، وتصاميم حصرية.',
            categoryId: l3['ألبسة نسائية'] || l2['ألبسة وأزياء'], governorateId: govs['دمشق'],
            phone: '0911000002', whatsapp: '963911000002', address: 'دمشق، كفرسوسة',
            isFeatured: false, isActive: true, viewCount: 445,
        },
        // ── إلكترونيات
        {
            name: 'مركز النور للإلكترونيات',
            description: 'هواتف ذكية، لابتوبات، تلفزيونات، وجميع الإكسسوارات. وكيل معتمد لأبرز الماركات العالمية.',
            categoryId: l3['هواتف ذكية'] || l2['إلكترونيات'], governorateId: govs['حمص'],
            phone: '0313456789', whatsapp: '963313456789', website: 'https://alnour-electronics.sy',
            facebook: 'AlnourElectronics', address: 'حمص، شارع الجيش',
            isFeatured: true, isActive: true, viewCount: 1890,
        },
        {
            name: 'تك هاوس للتقنية',
            description: 'متجر متخصص بالحواسيب المحمولة وقطع الغيار والصيانة الاحترافية.',
            categoryId: l3['لابتوبات وحواسيب'] || l2['إلكترونيات'], governorateId: govs['حلب'],
            phone: '0214567890', address: 'حلب، الفرقان',
            isFeatured: false, isActive: true, viewCount: 320,
        },
        // ── أطباء
        {
            name: 'د. أحمد المصري - قلب وشرايين',
            description: 'أخصائي أمراض القلب والأوعية الدموية. خبرة 20 سنة، حاصل على البورد الأوروبي. يستقبل المرضى يومياً.',
            categoryId: l2['طب القلب'], governorateId: govs['دمشق'],
            phone: '0112222333', whatsapp: '963112222333', address: 'دمشق، المزة، عمارة سيتي',
            isFeatured: true, isActive: true, viewCount: 2340,
        },
        {
            name: 'د. سمر الحلبي - أسنان',
            description: 'طب وجراحة الفم والأسنان. تبييض، تقويم، زراعة فورية. بأسعار مناسبة ومواعيد مرنة.',
            categoryId: l2['طب الأسنان'], governorateId: govs['حلب'],
            phone: '0215678901', whatsapp: '963215678901', address: 'حلب، الحمدانية، برج الجوهرة',
            isFeatured: false, isActive: true, viewCount: 870,
        },
        {
            name: 'د. وليد عمر - طب عيون',
            description: 'فحص النظر، نظارات وعدسات، عمليات الليزك. أحدث الأجهزة وأدق النتائج.',
            categoryId: l2['طب العيون'], governorateId: govs['دمشق'],
            phone: '0113333444', address: 'دمشق، باب شرقي',
            isFeatured: false, isActive: true, viewCount: 560,
        },
        {
            name: 'د. رنا السيد - أطفال',
            description: 'طبيبة أطفال وحديثي الولادة. بورد عربي وعضو جمعية طب الأطفال العالمية.',
            categoryId: l2['طب الأطفال'], governorateId: govs['دمشق'],
            phone: '0114444555', whatsapp: '963114444555', address: 'دمشق، العدوي',
            isFeatured: false, isActive: true, viewCount: 430,
        },
        // ── تعليم
        {
            name: 'مركز المستقبل للغات',
            description: 'تعلم الإنجليزية، الفرنسية، والألمانية. مدرسون متخصصون، شهادات معتمدة دولياً، دروس أونلاين وحضوري.',
            categoryId: l3['لغة إنجليزية'] || l2['مراكز تدريب'], governorateId: govs['دمشق'],
            phone: '0115555666', whatsapp: '963115555666', website: 'https://mustaqbal-langs.sy',
            address: 'دمشق، أبو رمانة',
            isFeatured: true, isActive: true, viewCount: 1120,
        },
        {
            name: 'أستاذ كريم - دروس رياضيات',
            description: 'دروس خصوصية في الرياضيات والفيزياء لجميع المراحل. خبرة 15 سنة، نتائج مضمونة.',
            categoryId: l3['رياضيات وعلوم'] || l2['دروس خصوصية'], governorateId: govs['حمص'],
            phone: '0316789012', address: 'حمص، الواعر',
            isFeatured: false, isActive: true, viewCount: 240,
        },
        // ── سيارات
        {
            name: 'معرض الياسمين للسيارات',
            description: 'أضخم معرض سيارات مستعملة في دمشق. تشكيلة واسعة من جميع الماركات، أسعار تنافسية، ضمان لمدة 6 أشهر.',
            categoryId: l2['معارض سيارات'], governorateId: govs['دمشق'],
            phone: '0116666777', whatsapp: '963116666777', address: 'دمشق، طريق مطار',
            isFeatured: true, isActive: true, viewCount: 3200,
        },
        {
            name: 'كراج الحسن للصيانة',
            description: 'صيانة جميع أنواع السيارات. محركات، فرامل، كهرباء، إلكترونيات. قطع غيار أصلية ومضمونة.',
            categoryId: l3['صيانة محركات'] || l2['كراجات وصيانة'], governorateId: govs['دمشق'],
            phone: '0117777888', address: 'دمشق، قدسيا',
            isFeatured: false, isActive: true, viewCount: 780,
        },
        // ── عقارات
        {
            name: 'مكتب عقارات الأمل',
            description: 'بيع وإيجار شقق وأراضي وعقارات تجارية في جميع أنحاء دمشق وريفها. خبرة 25 سنة.',
            categoryId: l2['شقق للبيع'], governorateId: govs['دمشق'],
            phone: '0118888999', whatsapp: '963118888999', address: 'دمشق، المالكي',
            facebook: 'AmalEstates', isFeatured: true, isActive: true, viewCount: 1650,
        },
        // ── خدمات منزلية
        {
            name: 'أبو محمود للسباكة',
            description: 'خدمات السباكة الطارئة والعادية. تمديدات، إصلاح تسريبات، تركيب أجهزة صحية. متاح 24/7.',
            categoryId: l2['سباكة'], governorateId: govs['دمشق'],
            phone: '0119999000', address: 'دمشق والريف', isFeatured: false, isActive: true, viewCount: 320,
        },
        {
            name: 'شركة النظافة المثالية',
            description: 'تنظيف شامل للمنازل والمكاتب والشركات. عمالة مدربة، مواد صديقة للبيئة، أسعار حسب المساحة.',
            categoryId: l2['تنظيف'], governorateId: govs['دمشق'],
            phone: '0990001111', whatsapp: '963990001111', address: 'دمشق - نخدم جميع المناطق',
            isFeatured: false, isActive: true, viewCount: 540,
        },
        // ── جمال وعناية
        {
            name: 'صالون لورا للتجميل',
            description: 'صالون نسائي متكامل: كوافير، مانيكير، باديكير، عناية بالبشرة، حمامات مغربية. حجز مسبق متاح.',
            categoryId: l2['صالونات نساء'], governorateId: govs['دمشق'],
            phone: '0991111222', whatsapp: '963991111222', instagram: 'loura.salon',
            address: 'دمشق، كفرسوسة، مول سيتي',
            isFeatured: true, isActive: true, viewCount: 1100,
        },
        {
            name: 'برستيج للحلاقة الرجالية',
            description: 'حلاقة رجالية عصرية، تشكيل اللحية، علاجات الشعر. أحدث الأدوات وأفضل المنتجات.',
            categoryId: l2['حلاقة رجالية'], governorateId: govs['حلب'],
            phone: '0991111333', instagram: 'prestige.barber',
            address: 'حلب، الشعار',
            isFeatured: false, isActive: true, viewCount: 390,
        },
        // ── رياضة
        {
            name: 'نادي فيت لايف الرياضي',
            description: 'أضخم صالة رياضية في دمشق. أجهزة حديثة، مدربون معتمدون، مسبح، ساونا. اشتراكات شهرية وسنوية.',
            categoryId: l2['صالات رياضية'], governorateId: govs['دمشق'],
            phone: '0992222333', whatsapp: '963992222333', website: 'https://fitlife-gym.sy',
            instagram: 'fitlife.damascus', address: 'دمشق، الرابية',
            isFeatured: true, isActive: true, viewCount: 2760,
        },
        // ── سفر
        {
            name: 'وكالة النجمة للسفر والسياحة',
            description: 'حجوزات طيران، فنادق، رحلات منظمة داخلية وخارجية. عروض مميزة وأسعار تنافسية طوال العام.',
            categoryId: l2['وكالات سفر'], governorateId: govs['دمشق'],
            phone: '0113344556', whatsapp: '963113344556', website: 'https://star-travel.sy',
            facebook: 'StarTravelSyria', address: 'دمشق، أبو رمانة',
            isFeatured: true, isActive: true, viewCount: 1430,
        },
        // ── محافظات مختلفة
        {
            name: 'فندق الشاطئ الذهبي',
            description: 'فندق 4 نجوم على شاطئ اللاذقية مباشرة. غرف مطلة على البحر، مسبح، مطعم، خدمة 24 ساعة.',
            categoryId: l2['فنادق'], governorateId: govs['اللاذقية'],
            phone: '0413456789', whatsapp: '963413456789', website: 'https://golden-beach-hotel.sy',
            address: 'اللاذقية، شارع الكورنيش', isFeatured: true, isActive: true, viewCount: 4200,
        },
        {
            name: 'مطعم البحر الأزرق',
            description: 'مأكولات بحرية طازجة مباشرة من الصيادين. سمك، جمبري، كالاماري. إطلالة بانورامية على المتوسط.',
            categoryId: l2['مطاعم شرقية'], governorateId: govs['طرطوس'],
            phone: '0434567890', address: 'طرطوس، الشاطئ الأزرق',
            isFeatured: false, isActive: true, viewCount: 890,
        },
        {
            name: 'د. حسن عمار - طب عام',
            description: 'طبيب عام. كشف وعلاج، صيدلانية متكاملة ملحقة بالعيادة.',
            categoryId: l2['جراحة عامة'], governorateId: govs['حماة'],
            phone: '0335678901', address: 'حماة، حي العليليات',
            isFeatured: false, isActive: true, viewCount: 210,
        },
        {
            name: 'مطعم دير الزور الأصيل',
            description: 'أطباق من بادية الشام، حساء العدس، الرشتة الفراتية، ومنسف بالطريقة الأصيلة.',
            categoryId: l2['مطاعم شرقية'], governorateId: govs['دير الزور'],
            phone: '0516789012', address: 'دير الزور، وسط المدينة',
            isFeatured: false, isActive: true, viewCount: 340,
        },
        {
            name: 'محل السويداء للمجوهرات',
            description: 'مجوهرات ذهبية وفضية أصيلة، تصاميم تراثية جنوبية وعصرية. نشتري ونبيع الذهب.',
            categoryId: l2['مجوهرات وساعات'], governorateId: govs['السويداء'],
            phone: '0163456789', address: 'السويداء، شارع المدينة',
            isFeatured: false, isActive: true, viewCount: 450,
        },
    ];

    for (const listing of listings) {
        await prisma.listing.create({ data: listing as any });
    }
    console.log(`✅ ${listings.length} إدخال`);

    // ─── 5. Notifications ────────────────────────────────────────────────────
    await prisma.notification.deleteMany({});

    const notifications = [
        {
            title: 'مرحباً بكم في دليلك! 👋',
            body: 'نحن سعداء بانضمامك إلى منصة دليلك. استكشف الأقسام والخدمات المتاحة في محافظتك وتواصل مع أفضل الأعمال.',
            isActive: true,
        },
        {
            title: 'تم إضافة أقسام جديدة 🆕',
            body: 'تمت إضافة قسمي "سفر وسياحة" و"رياضة وترفيه" مع مئات الإدخالات الجديدة. اكتشف الخدمات الجديدة الآن!',
            linkType: 'category',
            linkId: l1['سفر وسياحة'] || null,
            isActive: true,
        },
        {
            title: 'عروض العيد 🎉',
            body: 'استمتع بعروض حصرية من أفضل المطاعم والمحلات بمناسبة العيد. تصفح التخفيضات واستفد من أفضل الأسعار.',
            isActive: true,
        },
        {
            title: 'انضم إلى دليلك كصاحب عمل 💼',
            body: 'هل لديك مطعم، محل، أو خدمة؟ أضف نشاطك التجاري مجاناً على دليلك ووسّع دائرة عملائك اليوم.',
            isActive: true,
        },
        {
            title: 'تحديث التطبيق متاح 📲',
            body: 'تحديث جديد متاح بمميزات محسّنة وواجهة أسرع وأكثر سهولة. حدّث التطبيق الآن للاستمتاع بأفضل تجربة.',
            isActive: false,
        },
    ];

    for (const n of notifications) {
        await prisma.notification.create({ data: n as any });
    }
    console.log(`✅ ${notifications.length} إشعار`);

    // ─── 6. Ads ───────────────────────────────────────────────────────────────
    await prisma.ad.deleteMany({});

    const now = new Date();
    const in90days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const ads = [
        {
            image: '/uploads/ad-placeholder-1.jpg',
            linkType: 'category',
            linkId: l1['مطاعم وكافيهات'],
            order: 0,
            isActive: true,
            startDate: now,
            endDate: in90days,
        },
        {
            image: '/uploads/ad-placeholder-2.jpg',
            linkType: 'category',
            linkId: l1['محلات تجارية'],
            order: 1,
            isActive: true,
            startDate: now,
            endDate: in90days,
        },
        {
            image: '/uploads/ad-placeholder-3.jpg',
            linkUrl: 'https://dalilkk.sy',
            order: 2,
            isActive: true,
            startDate: now,
            endDate: in90days,
        },
    ];

    for (const ad of ads) {
        await prisma.ad.create({ data: ad as any });
    }
    console.log(`✅ ${ads.length} إعلان`);

    // ─── Summary ──────────────────────────────────────────────────────────────
    console.log('\n' + '═'.repeat(50));
    console.log('🎉 تمت تهيئة قاعدة البيانات بنجاح!');
    console.log('═'.repeat(50));
    console.log(`📌 بيانات الدخول: admin / admin123`);
    console.log(`🏛️  المحافظات: ${governorateNames.length}`);
    console.log(`📂  الأقسام: ${totalCats} (${catL1.length} + ${catL2.length} + ${catL3.length})`);
    console.log(`📋  الإدخالات: ${listings.length}`);
    console.log(`🔔  الإشعارات: ${notifications.length}`);
    console.log(`📢  الإعلانات: ${ads.length}`);
    console.log('═'.repeat(50));
}

main()
    .catch((e) => {
        console.error('❌ فشل الـ seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
