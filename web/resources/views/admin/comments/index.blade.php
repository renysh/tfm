@extends('layouts.admin')
@section('content')
    <div style="margin-bottom: 10px;" class="row">
        <div class="col-lg-12">
            <button type="button" class="btn btn-success" id="btnAddComment">Agregar Comentario</button>
        </div>
    </div>
    <div class="card">
        <div class="card-header">
            Comentarios
        </div>

        <div class="card-body">

            <div class="table-responsive">
                <table class=" table table-bordered table-striped table-hover datatable">
                    <thead>
                    <tr>
                        <th>
                            Id
                        </th>
                        <th>
                            Nombre
                        </th>
                        <th>
                            Calificación
                        </th>
                        <th>
                            Comentario
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($comments as $key => $comment)
                        <tr data-entry-id="{{ $comment->id }}">
                            <td>
                                {{ $comment->id ?? '' }}
                            </td>
                            <td>
                                {{ $comment->nombre ?? '' }}
                            </td>
                            <td>
                                {{ $comment->calificacion ?? '' }}
                            </td>
                            <td>
                                <?php echo($comment->comentario ?? '')?>

                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="modal fade" id="ajaxModel" tabindex="-1" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog" role="document">

            <div class="modal-content">

                <div class="modal-header">

                    <h4 class="modal-title" id="modelHeading">Ingresar Comentario</h4>

                </div>

                <form id="commentForm" name="commentForm" class="form-horizontal">
                    <div class="modal-body">

                        <div class="form-group">

                            <label for="name" class="col-sm-2 control-label">Nombre</label>

                            <div class="col-sm-12">
                                <input type="text" class="form-control" id="txtName" name="name"
                                       placeholder="Ingrese su nombre"
                                       value="" maxlength="50" required="">
                            </div>

                        </div>

                        <div class="form-group">

                            <label for="name" class="col-sm-2 control-label">Calificación</label>

                            <div class="col-sm-12">
                                <input type="text" class="form-control" id="txtCalification" name="calification"
                                       placeholder="Ingrese la calificación"
                                       value="" maxlength="1" required="">
                            </div>

                        </div>


                        <div class="form-group">

                            <label class="col-sm-2 control-label">Comentario</label>

                            <div class="col-sm-12">

                                <textarea id="txtComment" name="comment" required="" placeholder="Ingrese Comentario"
                                          class="form-control"></textarea>

                            </div>

                        </div>


                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary" id="saveBtn">Enviar</button>
                    </div>
                </form>

            </div>

        </div>

    </div>
@endsection
@section('scripts')
    @parent
    <script>

        $('#btnAddComment').click(function () {

            $('#ajaxModel').modal('show');
            $('#saveBtn').html('Guardar');

        });

        $('#saveBtn').click(function (e) {

            e.preventDefault();

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            $(this).html('Sending..');

            var _nombre = $("#txtName").val();
            var _calificacion = $("#txtCalification").val();
            var _comentario = $("#txtComment").val();


            $.ajax({

                data: {
                    nombre: _nombre,
                    calificacion: _calificacion,
                    comentario: _comentario
                },
                url: "{{ route('admin.comments.store') }}",
                type: "POST",

                success: function (data) {
                    $('#commentForm').trigger("reset");
                    $('#ajaxModel').modal('hide');

                    location.reload();
                },

                error: function (data) {

                    console.log('Error:', data);

                    $('#saveBtn').html('Save Changes');

                }

            });

        });


    </script>
@endsection