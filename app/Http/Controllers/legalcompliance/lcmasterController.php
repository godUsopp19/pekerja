<?php

namespace App\Http\Controllers\legalcompliance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

//import Model
use App\LCMaster;
use Illuminate\Support\Carbon;



class lcmasterController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

     public function dashPekerja(Request $request)
    {
        try{
            $data = LCMaster::selectRaw('*, 1 as jml')->whereNotNull('tanggal')->get();

            // $data = LCMaster::selectRaw('*, 
            // case when ktp = "Ada" then 1 else 0 end as ktp_ada, 
            // case when ktp = "Tidak Ada" then 1 else 0 end as ktp_tidakada,
            // case when id_badge = "Ada" then 1 else 0 end as badge_ada,
            // case when id_badge = "Tidak Ada" then 1 else 0 end as badge_tidakada,
            // case when kk = "Ada" then 1 else 0 end as kk_ada,
            // case when kk = "Tidak Ada" then 1 else 0 end as kk_tidakada,
            // case when bpjs_ketenagakerjaan = "Ada" then 1 else 0 end as bpjstenagakerja_ada,
            // case when bpjs_ketenagakerjaan = "Tidak Ada" then 1 else 0 end as bpjstenagakerja_tidakada,
            // case when bpjs_kesehatan = "Ada" then 1 else 0 end as bpjskesehatan_ada,
            // case when bpjs_kesehatan = "Tidak Ada" then 1 else 0 end as bpjskesehatan_tidakada,
            // case when bpjs_pensiun = "Ada" then 1 else 0 end as bpjspensiun_ada,
            // case when bpjs_pensiun = "Tidak Ada" then 1 else 0 end as bpjspensiun_tidakada,
            // case when wajib_lapor = "Ada" then 1 else 0 end as wajiblapor_ada,
            // case when wajib_lapor = "Tidak Ada" then 1 else 0 end as wajiblapor_tidakada,
            // case when kontrak_pekerja = "Ada" then 1 else 0 end as kontrakpekerja_ada,
            // case when kontrak_pekerja = "Tidak Ada" then 1 else 0 end as kontrakpekerja_tidakada,
            // case when slip_gaji = "Ada" then 1 else 0 end as slipgaji_ada,
            // case when slip_gaji = "Tidak Ada" then 1 else 0 end as slipgaji_tidakada
            // ')
            // ->whereNotNull('tanggal')
            // ->whereYear('tanggal',2021)
            // ->get();

            return response() ->json($data);

        } catch (\Exception $e){

            return response()->json(["status" => "error", "message" => $e->getMessage()]);
        }
        
    }
    
    public function index()
    {
        try {
            $data = LCMaster::all();

            return response()->json(['status' => "show", "message" => "Menampilkan Data" , 'data' => $data]);

        } catch (\Exception $e){

            return response()->json(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $requestData = $request->all();

        try {
            $request->validate([

                'no_nik' => 'required | unique:l_c_masters',

            ]);
            LCMaster::create($requestData);

            return response()->json(["status" => "success", "message" => "Berhasil Menambahkan Data"]);

        } catch (\Exception $e){

            return response()->json(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        return view('pages/legalcompliance/lcmaster');
    }
 
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $requestData = $request->all();
        
        try {
            $data = LCMaster::findOrFail($id);
            if($request->nik) {

                if($data->nik == $request->nik){
                    $request->validate([
                        
                        'no_nik' => 'required | unique:l_c_masters',
                        
                    ]);
                    
                }
            }

            $data->update($requestData);
            
            return response()->json(["status" => "success", "message" => "Berhasil Ubah Data"]);

        } catch (\Exception $e){

            return response()->json(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $data = LCMaster::where('id',$id)->delete();

            return response()->json(["status" => "success", "message" => "Berhasil Hapus Data"]);

        } catch (\Exception $e){

            return response()->json(["status" => "error", "message" => $e->getMessage()]);
        }
    }
    
    
}
