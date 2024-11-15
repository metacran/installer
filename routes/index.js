import express from 'express';
import fs from 'fs';
const fsp = fs.promises;
import mustache from 'mustache';
const router = express.Router();

async function handler(req, res) {
  const ua = req.header('User-Agent');
  if (ua.match(/^R /) || ua.match(/^libcurl/)) {
    render_r(req, res);
  } else if (ua.match(/^curl/) || ua.match(/^Wget/)) {
    render_sh(req, res);
  } else {
    res.render('index', { title: 'Install pak' });
  }
};

router.get('/', handler);
router.get(['/dev', '/devel'], async function(req, res) {
  req.query['stream'] = 'devel';
  handler(req, res);
});

async function get_r(req) {
  const r = await fsp.readFile('scripts/install.R', 'UTF-8');
  console.log(req.query);
  var stream;
  if (req.query['stream'] !== undefined) {
    stream = req.query['stream'];
    if (stream == 'dev') {
      stream = 'devel';
    }
  } else if (req.query['dev'] !== undefined ||
             req.query['devel'] !== undefined) {
    stream = 'devel';
  } else if (req.query['rc'] !== undefined) {
    stream = 'rc';
  } else {
    stream = "stable"
  }
  const data = {
    stream: stream
  };
  const out = mustache.render(r, data);
  return out;
}

async function render_r(req, res) {
  res.set('Content-Type', 'text/plain');
  const r = await get_r(req);
  res.send(r);
}

async function render_sh(req, res) {
  res.set('Content-Type', 'text/plain');
  const r = await get_r(req);
  res.send('R -q --no-save <<EOF\n' + r + '\nEOF\n');
}

export default router;
