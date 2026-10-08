"""Prepare an independent serving copy; preserve source bytes and license scope."""
import json,struct,pathlib,hashlib,sys
src=pathlib.Path(sys.argv[1])
b=src.read_bytes();n=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+n]);payload=b[20+n:]
for m in j['materials']:
 t=m.get('extensions',{}).get('VRMC_materials_mtoon')
 if t and m.get('alphaMode')!='BLEND':t.update(outlineWidthMode='worldCoordinates',outlineWidthFactor=.001,outlineColorFactor=[.07,.035,.025],outlineLightingMixFactor=0)
meta=j['extensions']['VRMC_vrm']['meta'];meta['name']='Null Evi';meta['version']='0.1.1-viewer';meta['copyrightInformation']='GOROman. Public viewer publication authorized by owner. Personal non-profit scope retained; no additional redistribution permission granted.'
s=json.dumps(j,ensure_ascii=False,separators=(',',':')).encode();s+=b' '*((-len(s))%4);out=struct.pack('<III',0x46546c67,2,20+len(s)+len(payload))+struct.pack('<II',len(s),0x4e4f534a)+s+payload
pathlib.Path('public/models/Naruebi.vrm').write_bytes(out)
pathlib.Path('MODEL_PROVENANCE.json').write_text(json.dumps({'source_sha256':hashlib.sha256(b).hexdigest(),'published_sha256':hashlib.sha256(out).hexdigest(),'authors':meta['authors'],'changes':['Enabled standard MToon outline generation for opaque surfaces','Updated display name/version and copyright wording for owner-authorized viewer publication'],'license_scope':{'commercialUsage':meta['commercialUsage'],'allowRedistribution':meta['allowRedistribution'],'avatarPermission':meta['avatarPermission']},'original_geometry_and_embedded_texture_bytes_preserved':True},indent=2))
