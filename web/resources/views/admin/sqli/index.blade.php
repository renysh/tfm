@extends('layouts.admin')
@section('content')
    @can('product_create')
        <div style="margin-bottom: 10px;" class="row">
            <div class="col-lg-12">
                Inyección SQL
            </div>
        </div>
    @endcan
    <div class="card">
        <div class="card-header">
            Busqueda de Usuario por ID (GET)
        </div>

        <div class="card-body">

            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="ID usuario" aria-label="Usuario ID"
                       aria-describedby="button-addon2" id="txtId">
                <div class="input-group-append">
                    <button class="btn btn-primary" type="button" id="button-search-by-id">Buscar</button>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <div class="table-responsive">
                <table id="resultados" class=" table table-bordered table-striped table-hover datatable">
                    <thead>
                    <th>
                        ID
                    </th>
                    <th>
                        Nombre
                    </th>
                    <th>
                        email
                    </th>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header">
            Busqueda de Usuario por Nombre (POST)
        </div>

        <div class="card-body">

            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Nombre usuario" aria-label="Usuario nombre"
                       aria-describedby="button-addon2" id="txtNombre">
                <div class="input-group-append">
                    <button class="btn btn-primary" type="button" id="button-search-by-name">Buscar</button>
                </div>
            </div>

        </div>

        <div class="card-footer">
            <div class="table-responsive">
                <table id="resultados_2" class=" table table-bordered table-striped table-hover datatable">
                    <thead>
                    <th>
                        ID
                    </th>
                    <th>
                        Nombre
                    </th>
                    <th>
                        email
                    </th>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>

    </div>


@endsection
@section('scripts')
    @parent
    <script>

        $("#button-search-by-id").click(function (e) {

            $('#resultados tbody > tr').remove();
            e.preventDefault();
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            var _id = $("#txtId").val();
            $.ajax({
                type: 'POST',
                url: "{{ route('admin.sqli.searchUserById') }}",
                data: {id: _id},
                success: function (data) {
                    var results = data.success;
                    results.forEach(function (persona, index) {
                        var nuevafila = "<tr><td>" +
                            persona.id + "</td><td>" +
                            persona.name + "</td><td>" +
                            persona.email + "</td></tr>";
                        $('#resultados').append(nuevafila);
                    });
                },
                error: function (x, xs, xt) {
                    //window.open(JSON.stringify(x));
                    alert(JSON.stringify(x));
                }
            });
        });


        $("#button-search-by-name").click(function (e) {

            $('#resultados_2 tbody > tr').remove();
            e.preventDefault();
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            var _nombre = $("#txtNombre").val();
            $.ajax({
                type: 'POST',
                url: "{{ route('admin.sqli.searchUserByName') }}",
                data: {name: _nombre},
                success: function (data) {
                    var results = data.success;
                    results.forEach(function (persona, index) {
                        var nuevafila = "<tr><td>" +
                            persona.id + "</td><td>" +
                            persona.name + "</td><td>" +
                            persona.email + "</td></tr>";
                        $('#resultados_2').append(nuevafila);
                    });
                },
                error: function (x, xs, xt) {
                    //window.open(JSON.stringify(x));
                    alert(JSON.stringify(x));
                }
            });
        });

    </script>
@endsection