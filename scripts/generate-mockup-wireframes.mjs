import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';

const inputDir = join(process.cwd(), 'docs', 'mockups', 'screens');
const outputDir = join(process.cwd(), 'docs', 'mockups', 'wireframes');

const names = {
  '01-login': 'Đăng nhập', '02-dashboard': 'Tổng quan', '03-profile': 'Hồ sơ cá nhân',
  '04-pos-sale': 'Bán hàng', '05-pos-returns': 'Trả hàng', '06-pos-return-form': 'Tạo phiếu trả hàng',
  '07-pos-shift': 'Ca làm việc', '08-pos-members': 'Khách hàng thành viên', '09-pos-loyalty': 'Điểm tích lũy',
  '10-pos-promotions': 'Khuyến mãi', '11-warehouse-purchase-orders': 'Đơn mua hàng',
  '12-warehouse-purchase-order-form': 'Tạo đơn mua hàng', '13-warehouse-transactions': 'Duyệt giao dịch kho',
  '14-warehouse-monitor': 'Giám sát tồn kho', '15-warehouse-reports': 'Báo cáo kho',
  '16-warehouse-products': 'Quản lý sản phẩm', '17-warehouse-product-form': 'Sản phẩm',
  '18-warehouse-suppliers': 'Nhà cung cấp', '19-warehouse-receive': 'Nhập hàng',
  '20-warehouse-inventory': 'Kiểm kê tồn kho', '21-warehouse-stock-count': 'Phiếu kiểm kho',
  '22-warehouse-stock-count-form': 'Tạo phiếu kiểm kho', '23-warehouse-adjustments': 'Điều chỉnh kho',
  '24-warehouse-adjustment-form': 'Tạo phiếu điều chỉnh', '25-warehouse-approval-status': 'Trạng thái phê duyệt',
  '26-warehouse-goods-receipts': 'Phiếu nhập kho', '27-warehouse-goods-receipt-form': 'Tạo phiếu nhập kho',
  '28-warehouse-barcode': 'In mã vạch', '29-hr-employees': 'Nhân viên',
  '30-hr-employee-form': 'Thêm nhân viên', '31-hr-shifts': 'Ca làm việc',
  '32-hr-shift-form': 'Tạo ca làm việc', '33-hr-attendance': 'Chấm công',
  '34-hr-attendance-form': 'Tạo bản chấm công', '35-hr-timesheet': 'Bảng công',
  '36-hr-performance': 'Hiệu suất nhân viên', '37-admin-users': 'Người dùng',
  '38-admin-user-form': 'Tạo người dùng', '39-admin-approval-requests': 'Yêu cầu phê duyệt',
  '40-admin-monitoring': 'Giám sát hệ thống', '41-admin-permissions': 'Phân quyền',
  '42-admin-security-alerts': 'Cảnh báo bảo mật', '43-admin-notifications': 'Thông báo',
  '44-ceo-reports': 'Báo cáo quản trị', '45-ceo-approvals': 'Phê duyệt',
  '46-ceo-policies': 'Chính sách kinh doanh', '47-ceo-promotions': 'Duyệt khuyến mãi',
  '48-ceo-financial': 'Báo cáo tài chính', '49-ceo-operational': 'Báo cáo vận hành',
  '50-ceo-decisions': 'Quyết định chiến lược', '51-ceo-decision-form': 'Tạo quyết định',
  '52-report-inventory': 'Báo cáo kho & tồn kho', '53-report-employees': 'Hiệu suất nhân viên',
  '54-settings-system': 'Cài đặt hệ thống', '55-settings-business-rules': 'Quy tắc nghiệp vụ',
  '56-settings-business-rule-form': 'Tạo quy tắc nghiệp vụ', '57-forbidden': 'Không có quyền truy cập',
  '58-not-found': 'Không tìm thấy trang'
};

const esc = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const box = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="box" ${extra}/>`;
const line = (x1, y1, x2, y2, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="line ${extra}"/>`;
const text = (x, y, value, cls = 'label', anchor = '') => `<text x="${x}" y="${y}" class="${cls}" ${anchor ? `text-anchor="${anchor}"` : ''}>${esc(value)}</text>`;

function chrome(title, content, active = 'Tổng quan') {
  const menu = ['Tổng quan', 'Bán hàng', 'Kho hàng', 'Nhân sự', 'Quản trị', 'Báo cáo', 'Cài đặt'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <style>
    .frame,.box,.line{fill:#fff;stroke:#161616;stroke-width:3}.line{fill:none;stroke-width:2}.thin{stroke-width:1.5}.brand{font:700 29px Arial,sans-serif}.title{font:700 32px Arial,sans-serif}.subtitle{font:18px Arial,sans-serif}.label{font:17px Arial,sans-serif}.small{font:14px Arial,sans-serif}.muted{fill:#555}.button{font:700 17px Arial,sans-serif}.dash{stroke-dasharray:6 6}
  </style>
  <rect class="frame" x="14" y="14" width="1572" height="972" rx="14"/>
  <rect class="frame" x="14" y="14" width="1572" height="64" rx="14"/>
  <circle cx="48" cy="46" r="9" fill="none" stroke="#161616" stroke-width="3"/><circle cx="76" cy="46" r="9" fill="none" stroke="#161616" stroke-width="3"/><circle cx="104" cy="46" r="9" fill="none" stroke="#161616" stroke-width="3"/>
  ${box(165, 31, 630, 30)}
  <rect class="frame" x="46" y="103" width="1508" height="56" rx="8"/>
  ${text(76, 140, 'SMS', 'brand')}${text(216, 139, 'Supermarket Management System', 'label muted')}${text(1475, 139, 'Mockup user  ▾', 'label', 'end')}
  <rect x="46" y="159" width="245" height="762" fill="#fff" stroke="#161616" stroke-width="3"/>
  ${menu.map((m, i) => `${m === active ? `<rect x="47" y="${194 + i * 64}" width="8" height="43" fill="#161616"/>` : ''}${text(76, 222 + i * 64, m, 'label')}`).join('')}
  ${line(291, 159, 291, 921)}
  ${text(330, 211, title, 'title')}${content}
  <rect class="frame" x="46" y="921" width="1508" height="42" rx="0"/>${text(76, 948, 'SMS • Low-fidelity wireframe', 'small muted')}
  </svg>`;
}

function tablePage(title, id) {
  const rows = Array.from({ length: 6 }, (_, i) => {
    const y = 393 + i * 55;
    return `${line(332, y, 1500, y, 'thin')}${text(354, y + 34, `Dữ liệu ${String(i + 1).padStart(2, '0')}`, 'label')}${text(720, y + 34, 'Trạng thái', 'small muted')}${text(1110, y + 34, '20/07/2026', 'small muted')}${box(1370, y + 12, 92, 28)}${text(1416, y + 32, 'Xem', 'small', 'middle')}`;
  }).join('');
  return chrome(title, `${text(330, 245, `Màn hình ${id} • Danh sách và thao tác nhanh`, 'subtitle muted')}
    ${box(330, 280, 415, 44)}${text(352, 309, '⌕  Tìm kiếm...', 'label muted')}${box(1270, 280, 190, 44)}${text(1365, 309, '+  Thêm mới', 'button', 'middle')}
    ${box(330, 350, 1170, 390)}${text(354, 380, 'Tên / Mã', 'small muted')}${text(720, 380, 'Trạng thái', 'small muted')}${text(1110, 380, 'Cập nhật', 'small muted')}${text(1416, 380, 'Thao tác', 'small muted', 'middle')}${rows}
    ${box(330, 775, 1170, 90)}${text(354, 811, 'Hiển thị 1–6 / 6 kết quả', 'label muted')}${box(1360, 796, 44, 36)}${text(1382, 821, '‹', 'button', 'middle')}${box(1415, 796, 44, 36)}${text(1437, 821, '›', 'button', 'middle')}`, section(id));
}

function formPage(title, id) {
  const fields = ['Tên thông tin *', 'Mã / tham chiếu *', 'Ngày áp dụng', 'Trạng thái'];
  const controls = fields.map((field, i) => { const x = 330 + (i % 2) * 590; const y = 310 + Math.floor(i / 2) * 105; return `${text(x, y, field, 'label')}${box(x, y + 16, 535, 46)}${text(x + 18, y + 46, 'Nhập thông tin', 'small muted')}`; }).join('');
  return chrome(title, `${text(330, 245, `Màn hình ${id} • Nhập và xác nhận thông tin`, 'subtitle muted')}${box(330, 275, 1170, 420)}${controls}
    ${text(330, 555, 'Danh sách chi tiết', 'label')}${box(330, 575, 1170, 84)}${line(350, 610, 1465, 610, 'thin dash')}${text(925, 640, '+ Thêm dòng dữ liệu', 'label muted', 'middle')}
    ${box(1195, 735, 130, 45)}${text(1260, 764, 'Hủy', 'button', 'middle')}${box(1340, 735, 160, 45)}${text(1420, 764, 'Lưu lại', 'button', 'middle')}`, section(id));
}

function dashboard(title, id) {
  const cards = ['Doanh thu', 'Đơn hàng', 'Sản phẩm', 'Cảnh báo'];
  const cardMarkup = cards.map((card, i) => { const x = 330 + i * 290; return `${box(x, 280, 255, 110)}${text(x + 20, 315, card, 'label')}${text(x + 20, 360, i === 0 ? '0 đ' : '0', 'title')}`; }).join('');
  return chrome(title, `${text(330, 245, `Màn hình ${id} • Tóm tắt hoạt động`, 'subtitle muted')}${cardMarkup}
    ${box(330, 430, 700, 330)}${text(360, 470, 'Biểu đồ xu hướng', 'label')}${line(375, 700, 970, 700)}${line(375, 500, 375, 700)}<polyline points="390,665 495,620 600,650 710,535 815,590 940,490" fill="none" stroke="#161616" stroke-width="4"/>
    ${box(1060, 430, 440, 330)}${text(1090, 470, 'Ghi chú / cảnh báo', 'label')}${[0,1,2,3].map(i=>`${line(1090, 520+i*48, 1460, 520+i*48, 'thin')}`).join('')}
    ${box(330, 800, 1170, 66)}${text(355, 841, 'Hoạt động gần đây', 'label')}${line(620, 820, 620, 850, 'thin')}${text(645, 841, 'Chưa có dữ liệu', 'label muted')}`, section(id));
}

function posSale(title, id) {
  return chrome(title, `${text(330, 245, `Màn hình ${id} • Điểm bán hàng`, 'subtitle muted')}${box(330, 280, 730, 555)}${text(355, 319, 'Tìm hàng hóa / quét mã vạch', 'label')}${box(355, 337, 680, 44)}${text(378, 366, '⌕  Nhập tên hoặc mã sản phẩm', 'small muted')}${[0,1,2,3].map(i=>{const x=355+(i%2)*330,y=415+Math.floor(i/2)*150;return `${box(x,y,300,118)}${box(x+18,y+16,82,78)}${text(x+118,y+45,'Sản phẩm', 'label')}${text(x+118,y+78,'0 đ', 'label muted')}`}).join('')}
    ${box(1090,280,410,555)}${text(1120,319,'Hóa đơn hiện tại','label')}${line(1120,340,1470,340,'thin')}${text(1295,470,'Chưa có sản phẩm','label muted','middle')}${line(1120,710,1470,710)}${text(1120,750,'Tổng thanh toán','label')}${text(1470,750,'0 đ','title','end')}${box(1120,775,350,44)}${text(1295,804,'Thanh toán','button','middle')}`, 'Bán hàng');
}

function errorPage(title, id, code) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><style>.frame,.box{fill:#fff;stroke:#161616;stroke-width:3}.brand{font:700 29px Arial,sans-serif}.title{font:700 34px Arial,sans-serif}.code{font:700 150px Arial,sans-serif}.label{font:18px Arial,sans-serif}.button{font:700 18px Arial,sans-serif}</style><rect class="frame" x="14" y="14" width="1572" height="972" rx="14"/><rect class="frame" x="14" y="14" width="1572" height="64" rx="14"/><circle cx="48" cy="46" r="9" fill="none" stroke="#161616" stroke-width="3"/><circle cx="76" cy="46" r="9" fill="none" stroke="#161616" stroke-width="3"/><circle cx="104" cy="46" r="9" fill="none" stroke="#161616" stroke-width="3"/>${box(165,31,630,30)}${text(75,135,'SMS','brand')}${text(800,360,code,'code','middle')}${text(800,425,title,'title','middle')}${text(800,462,`Màn hình ${id} • Bạn không thể tiếp tục tại đây.`, 'label','middle')}${box(670,510,260,48)}${text(800,541,'← Quay về trang chủ','button','middle')}<rect class="box" x="530" y="625" width="540" height="120" rx="12"/>${text(800,680,'Minh họa trạng thái hệ thống','label','middle')}</svg>`;
}

function login(title, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><style>.frame,.box,.line{fill:#fff;stroke:#161616;stroke-width:3}.line{fill:none;stroke-width:2}.brand{font:700 30px Arial,sans-serif}.title{font:700 34px Arial,sans-serif}.label{font:18px Arial,sans-serif}.small{font:14px Arial,sans-serif}.button{font:700 18px Arial,sans-serif}</style><rect class="frame" x="14" y="14" width="1572" height="972" rx="14"/><rect class="frame" x="14" y="14" width="1572" height="64" rx="14"/><circle cx="48" cy="46" r="9" fill="none" stroke="#161616" stroke-width="3"/><circle cx="76" cy="46" r="9" fill="none" stroke="#161616" stroke-width="3"/><circle cx="104" cy="46" r="9" fill="none" stroke="#161616" stroke-width="3"/>${box(165,31,630,30)}${box(46,103,1508,56)}${text(75,140,'SMS','brand')}${text(1475,140,'Login','label','end')}${text(100,280,'Supermarket System','title')}${line(100,315,460,315)}${text(100,355,'Hệ thống quản lý siêu thị', 'label')}${box(130,420,380,220)}${box(170,515,90,90)}${box(280,475,110,130)}${box(410,535,65,70)}${line(100,670,530,670)}${text(100,720,'• Quản lý tập trung','label')}${text(100,760,'• Theo dõi hàng hóa','label')}${text(100,800,'• Báo cáo nhanh','label')}${box(690,205,550,650)}${text(965,300,'◯','title','middle')}${text(965,350,title,'title','middle')}${text(765,405,'Tên đăng nhập','label')}${box(765,420,400,48)}${text(785,451,'Nhập tên đăng nhập','small')}${text(765,505,'Mật khẩu','label')}${box(765,520,400,48)}${text(785,551,'Nhập mật khẩu','small')}${box(765,595,20,20)}${text(802,612,'Ghi nhớ','label')}${text(1165,612,'Quên mật khẩu?','label','end')}${box(765,645,400,52)}${text(965,678,'Đăng nhập','button','middle')}${text(765,735,'ĐĂNG NHẬP NHANH','small')}${[0,1,2,3].map(i=>{const x=765+(i%2)*205,y=755+Math.floor(i/2)*55;return `${box(x,y,190,42)}${text(x+95,y+27,['CEO','Admin','Thu ngân','Quản lý kho'][i],'small','middle')}`}).join('')}<rect class="frame" x="1270" y="205" width="230" height="650" rx="10"/>${text(1300,260,'Notes','title')}${[0,1,2,3].map(i=>line(1300,310+i*55,1465,310+i*55)).join('')}</svg>`;
}

function section(id) {
  if (id.includes('pos')) return 'Bán hàng';
  if (id.includes('warehouse') || id.includes('report-inventory')) return 'Kho hàng';
  if (id.includes('hr') || id.includes('report-employees')) return 'Nhân sự';
  if (id.includes('admin')) return 'Quản trị';
  if (id.includes('ceo')) return 'Báo cáo';
  if (id.includes('settings')) return 'Cài đặt';
  return 'Tổng quan';
}

function render(id) {
  const title = names[id] ?? id;
  if (id === '01-login') return login(title, id);
  if (id === '57-forbidden') return errorPage(title, id, '403');
  if (id === '58-not-found') return errorPage(title, id, '404');
  if (id === '04-pos-sale') return posSale(title, id);
  if (id.includes('form')) return formPage(title, id);
  if (['02-dashboard','14-warehouse-monitor','15-warehouse-reports','36-hr-performance','40-admin-monitoring','44-ceo-reports','48-ceo-financial','49-ceo-operational','52-report-inventory','53-report-employees'].some(key => id.includes(key))) return dashboard(title, id);
  return tablePage(title, id);
}

await mkdir(outputDir, { recursive: true });
const sourceFiles = (await readdir(inputDir)).filter(file => file.endsWith('.png')).sort();
for (const sourceFile of sourceFiles) {
  const id = parse(sourceFile).name;
  await writeFile(join(outputDir, `${id}-mockup.svg`), render(id), 'utf8');
}
await writeFile(join(outputDir, 'README.md'), `# SMS low-fidelity wireframes\n\n58 editable SVG mockups generated from the matching screenshots in \`../screens\`. The original screenshots are unchanged.\n`, 'utf8');
console.log(`Generated ${sourceFiles.length} wireframes in ${outputDir}`);
