<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;
use Hash;
use App\Jabatan;
use App\Agama;
use App\SuratMasuk;
use App\SuratKeluar;
use App\Disposisi;
use App\Karyawan;

use Illuminate\Support\Carbon;


class ListController extends Controller
{
    public function listAgama() {
        return db::table('agamas')->select('id','keterangan_agama')->get();
    }

    public function listGender() {
        return db::table('genders')->select('id','keterangan_gender','keterangan_lp')->get();
    }

    public function listDepartemen() {
        return db::table('departemens')->select('id','nama_departemen','keterangan_departemen')->get();
    }

    public function listKontraktor() {
        return db::table('kontraktors')->select('id','nama_kontraktor','keterangan_kontraktor')->get();
    }
    
    public function listKegiatan() {
        return DB::table('kegiatans')->select('id','nama_kegiatan')->get();
    }

    public function listVaksin() {
        return DB::table('vaksins')->select('id','nama_vaksin','keterangan_vaksin')->get();
    }

    public function listEstate() {
        return DB::table('estates')->select('id','kode_estate','nama_estate')->get();
    }

    public function listPekerja() {
        return DB::table('l_c_masters')->select('id','nama_kontraktor','nama_pekerja','jenis_kelamin','agama','sektor','department','kk','no_kk','ktp','other_ktp_desc','no_nik','kota_penerbit','tempat_lahir','tgl_lahir','id_badge','no_badge','bpjs_ketenagakerjaan','no_bpjsketenagakerjaan','bpjs_kesehatan','no_bpjskesehatan','bpjs_pensiun','no_jaminanpensiun','wajib_lapor','no_wajiblapor','kontrak_pekerja','no_perjanjian','slip_gaji','jenis_bpjs','tanggal','alamat_ktp','keterangan_vaksin','lokasi_vaksin','lokasi_vaksin2','tgl_vaksin2')->get();
    }

    public function listRT() {
        return DB::table('rt')->select('id','nomor_rt')->get();
    }

}
